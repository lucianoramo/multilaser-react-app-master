import React, {useState, useEffect, useLayoutEffect} from "react";
import * as signalR from "@microsoft/signalr";
import axios from 'axios';
import _, { reject } from 'lodash';
import jwtDecode from 'jwt-decode';

const localtoken = localStorage.getItem('token');

export const Dispatch = React.createContext('Dispatch');

const showLog = false

//const baseURL = '/';
// LEMBRAR DE ALTERAR O QRCODE
// RELOAD NO LOGIN
const baseURL = 'http://192.168.0.149/';
//const baseURL = 'http://192.168.0.196:5000/';

export function logginReducer(state, action) {
    showLog && console.log('reducer', 'state:', state, 'action:', action)
    switch(action.type){
        case 'validated' : {
            return { 
                ...state,
                validated:action.payload
            }
        }
        case 'logout' : {
            return {
                ...state,
                validated:null
            }
        }
        case 'token' : {
            return {
                ...state,
                token:action.payload
            }
        }
        case 'area' : {
            return {
                ...state,
                area:action.payload
            }
        }
        case 'userdata' : {
            return {
                ...state,
                userdata:action.payload
            }
        }
        case 'mensagem' : {
            return {
                ...state,
                mensagem:action.payload
            }
        }
        case 'programacao' : {
            return {
                ...state,
                programacao:action.payload
            }
        }
        case 'salas' : {
            return {
                ...state, // copy the state (level 0)
                salas: {
                  ...state.salas, // copy the nested object (level 1)
                  [action.payload.id]: {  // update one specific house (using Computed Property syntax)
                    ...state.salas[action.payload.id],  // copy that specific house's properties
                    pessoas: action.payload.pessoas   // update its `points` property
                  }
/*
                  pessoas: action.payload.pessoas,
                  id:action.payload.id*/
                }
              }
        }
        case 'hub' : {
            return {
                ...state,
                hub:action.payload
            }
        }
        default : {
            return state     
        } 
    }
}


export function useFetchData(url, timeout) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  
    function init() {
      setData([]);
      setLoading(true);
      setLoading(false)
    }
  
    async function load() {
      init();
      setLoading(true);
      try {
        const result = await axios.fetch(url, {timeout: timeout}).data;
        setData(result);
      } catch (e) {
        setError(true);
      }
      setLoading(false);
    }
  
  return {data, loading, error, load};
  }
  



  export function useValidateToken ({token, qrtoken, dispatch}){
    const { log } = useLog();
    const [logged, setLogged] = useState(false);
    //console.log(token, qrtoken) 
    async function validate() {
        log && console.log('dentro', token, qrtoken) 
        let valid = await validateLocalToken(token);
        if(!valid){
            const invalid = await validateServerToken(qrtoken, dispatch)
            if(!invalid){
                setLogged(null)
            }else{
                //setLogged(true)
            }
        }else{
           // dispatch({type:'validated', payload:true})
            setLogged(true)
        }
    }

    useEffect(() => {
        if(token !== false) validate();
      }, [token]);

    return [{logged, validate}];
  }

  const validateLocalToken = async (token) => {

    return new Promise((resolve, reject) => {
        
        if(_.isNil(token)){
            resolve(false)
         }else if(token){
            
            resolve(true)
        }else{

        }
    })
   
}

const validateServerToken = async (qrtoken, dispatch) => {
    return new Promise((resolve, reject) => {
       // let webToken = query.get("qrtoken")
        try{
            var decoded = jwtDecode(qrtoken);
        }catch(err){showLog && console.log('erro decode token'); resolve(false)}

        if(!decoded){
            resolve(false)
        }else{
            localStorage.setItem('token', qrtoken);

            setTimeout(() => {
                dispatch({type:'token', payload:qrtoken})
                resolve(true)
            },1000)
            
        }
    })
}

export function useDimensions (targetRef, active) {
    const getDimensions = () => {
      return {
        width: targetRef.current ? targetRef.current.offsetWidth : 0,
        height: targetRef.current ? targetRef.current.offsetHeight : 0
      };
    };
  
    const [dimensions, setDimensions] = useState(getDimensions);
  
    const handleResize = () => {
      setDimensions(getDimensions());
    };
  
    useEffect(() => {
        if(active){
            window.addEventListener("resize", handleResize);
        }else{
            window.removeEventListener("resize", handleResize);
        }
      return () => window.removeEventListener("resize", handleResize);
    }, [active]);
  
    useLayoutEffect(() => {
      handleResize();
    }, []);
    return dimensions;
  }

  export const postServer = async (api, data, token) => {
        
    return new Promise((resolve, reject) => {

        let config = {
            headers: {
                Authorization: 'Bearer ' + (localtoken?localtoken:token),
            }
        }

        return axios
        .post(baseURL+api, data, config)
        .then(response => {return resolve({val:true, token:response})})
        .catch(error => {console.log('erro:', error.response); return resolve({val:false, token:error.response})});

    })
}

export const postServerLogin = async (api, data) => {
    return new Promise((resolve, reject) => {

             
        return axios
        .post(baseURL+api, data)
        .then(response => {return resolve({val:true, token:response})})
        .catch(error => {console.log('erro:', error.response); return resolve({val:false, token:error.response})});

    })
}

export const getServer = async (api, token) => {

        showLog && console.log(token)

        return new Promise((resolve, reject) => {

            let config = {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }

        return axios
        .get(baseURL+api, config)
        .then(response => {return resolve({val:true, token:response})})
        .catch(error => {console.log('erro:', error.response); return resolve({val:false, token:error.response})});
        })

}

export function useSocketConnection (userId, token){

    const { log } = useLog();
    const [socketMessage, setMessage] = useState(false);
    const [connected, setConnected] = useState(false);

    
    //console.log(token, qrtoken) 
    async function validate() {

        log && console.log('dentro socket!', userId, token) 

        let config = {
            headers: {
                Authorization: 'Bearer ' + token,
            }
        }

        let hubConnection = null

        await axios.get(baseURL+'api/events/now', config)
        .then(function (res) {

            hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(baseURL+"eventshub?user_id="+userId)
            .configureLogging(signalR.LogLevel.Information)  
            .build();
        })
        .catch(function (err) {
            log && console.log(err);
            alert('api/events/now retorno inválido');
        })
        ;

        if(hubConnection){

            await hubConnection.start().then(a => {

                setMessage({event:"hub", data:hubConnection})


                hubConnection.on("notficationReceived", recebido => {
                    log && console.log('HEADER MENSAGEM', recebido)
                    setMessage({event:"notficationReceived", data:recebido})
                });
        
                hubConnection.on("liveStarted", recebido => {
                    log && console.log('HEADER LIVE', recebido) 
                    setMessage({event:"liveStarted", data:recebido})
                });
        
                hubConnection.on("quizStarted", recebido => {
                    log && console.log('HEADER QUIZ', recebido)
                    setMessage({event:"quizStarted", data:recebido})
                });

                hubConnection.on("idle", recebido => {
                    log && console.log('idle', recebido)
                    setMessage({event:"idle", data:recebido})
                });

                hubConnection.on("ranking", recebido => {
                    log && console.log('HEADER RANKING', recebido)
                    setMessage({event:"ranking", data:recebido})
                });

                hubConnection.on("assocStarted", recebido => {
                    log && console.log('HEADER ASSO', recebido)
                    setMessage({event:"assocStarted", data:recebido})
                });

                hubConnection.on("roomUpdate", (id, pessoas) => {
                    log && console.log('HEADER room', id, pessoas)
                    setMessage({event:"roomUpdate", data:{id:id, pessoas:pessoas}})
                });

                hubConnection.on("disconnectAll", recebido => {
                    log && console.log('derruba usuários', recebido)
                    setMessage({event:"disconnectAll", data:recebido})
                });

                setConnected(true)
                log && console.log("connected");
            }); 

            hubConnection.onclose( a => {
                log && console.log(a, "socket closed");
            })
        }
    }

    useEffect(() => {
        if(userId !== false && token) {
            log && console.log(userId)
            validate();
        }
      }, [userId, token]);

    return [{connected, socketMessage}];
  }

  export function verificarCPF(c){
    var i;
    var s = c.cpf;
    var c = s.substr(0,9);
    var dv = s.substr(9,2);
    var d1 = 0;
    var v = false;
 
    for (i = 0; i < 9; i++){
        d1 += c.charAt(i)*(10-i);
    }
    if (d1 == 0){
        //alert("CPF Inválido1")
        v = true;
        return false;
    }
    d1 = 11 - (d1 % 11);
    if (d1 > 9) d1 = 0;
    if (dv.charAt(0) != d1){
       // alert("CPF Inválido2")
        v = true;
        return false;
    }
 
    d1 *= 2;
    for (i = 0; i < 9; i++){
        d1 += c.charAt(i)*(11-i);
    }
    d1 = 11 - (d1 % 11);
    if (d1 > 9) d1 = 0;
    if (dv.charAt(1) != d1){
       // alert("CPF Inválido3")
        v = true;
        return false;
    }
    if (!v) {
        return true
    }
}

export const useTimer = () => {
    const [inicial, setInicial] = useState(0);
    const [inverse, setInverse] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(inicial);
  
    useEffect(
      () => {
        let interval;
        if (isRunning) {
          interval = setInterval(
            () => setElapsedTime(prevElapsedTime => inverse?prevElapsedTime -.1: prevElapsedTime + .1),
            100
          );
        }
        return () => clearInterval(interval);
      },
      [isRunning]
    );

    useEffect(
        () => {
            setElapsedTime(inicial)
        },
        [inicial]
    );
  
    return {
      setInverse,
      setInicial,
      isRunning,
      setIsRunning,
      elapsedTime,
      setElapsedTime
    };
  };
  
  export const useStopwatch = () => {
    const [laps, setLaps] = useState([]);
    const { isRunning, setIsRunning, elapsedTime, setElapsedTime, setInverse, setInicial } = useTimer();
  
    const handleReset = () => {
      setIsRunning(false);
      setElapsedTime(0);
      setLaps([]);
    };
  
    const handleAddLap = () => {
      const prevTotal =
        laps.length > 0 ? laps.reduce((acc, curr) => acc + curr, 0) : 0;
      const currentLap = laps.length > 0 ? elapsedTime - prevTotal : elapsedTime;
      isRunning && setLaps([...laps, currentLap]);
    };
  
    return {
      setInicial:(e) => setInicial(e),
      setInverse:(e) => setInverse(e),
      elapsedTime: elapsedTime.toFixed(1),
      laps,
      addLap: () => handleAddLap(),
      resetTimer: () => handleReset(),
      startTimer: () => setIsRunning(true),
      stopTimer: () => setIsRunning(false),
      isRunning
    };
  };

  export function log(){
    return false

}

export const useLog = () => {
    const [log, setLog] = useState(false);

    useEffect(
        () => {
           
        },
        [log]
    );
  
    return {
        log
    };
  };