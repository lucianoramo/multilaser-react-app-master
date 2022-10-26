import React, {useEffect, useContext, useState} from 'react'
import { Dispatch, useValidateToken, log, getServer, useSocketConnection } from '../hooks/hooks';
import _ from 'lodash';
import { useHistory, useLocation } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import { ToastContainer, toast, Slide, Flip } from 'react-toastify';
import * as signalR from "@microsoft/signalr";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Image } from 'semantic-ui-react';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Header = () => {

    const [userId, setUserId] = useState(false)
    const [save, setSave] = useState(false)

    /*const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://192.168.0.149/eventshub?user_id="+userId)
    .configureLogging(signalR.LogLevel.Information)  
    .build();*/

    const reducer = useContext(Dispatch)
    const [{token, mensagem, programacao}, dispatch] = reducer;

    const [{connected, socketMessage}] = useSocketConnection(userId, token)

    const mobile = window.innerWidth<500?true:false
    const ridiculo = window.innerHeight<700?true:false

    const location = useLocation()

    //const [socketMessage, setSocketMessage] = useState(null)

    
    const history = useHistory();
    const [nome, setNome] = useState('')
    const query = useQuery();
    const [{logged}] = useValidateToken({token, qrtoken:query.get("qrtoken"), dispatch})
 
    useEffect(() => {
 
    }, [])

    useEffect(() => {

        if(connected){

            log() && console.log(connected)
            /*hubConnection.on("notficationReceived", recebido => {
                console.log('HEADER MENSAGEM', recebido)
                toast(recebido, {type: toast.TYPE.INFO, className: 'rotateY animated'})
            });
    
            hubConnection.on("liveStarted", recebido => {
                console.log('HEADER LIVE', recebido)
                getContent()
            });
    
            hubConnection.on("quizStarted", recebido => {
                console.log('HEADER QUIZ', recebido)
                getContent()
            });

            startConnection();*/
            //console.log(window.innerHeight)
           
        }

    }, [connected])


    
    useEffect(() => {

        if(socketMessage){

            log() && console.log(socketMessage)

            async function content() {

                switch(socketMessage.event){
                    case 'notficationReceived' :
                        toast(socketMessage.data, {type: toast.TYPE.INFO, className: 'rotateY animated'})
                    break

                    case 'hub' :
                        dispatch({type:'hub', payload:socketMessage.data})
                        //console.log('ROOM UPDATE', socketMessage.data)
                    break

                    case 'roomUpdate' :
                        //localStorage.removeItem('token');
                        //document.location.reload(true);
                       dispatch({type:'salas', payload:{id:socketMessage.data.id, pessoas:socketMessage.data.pessoas}})
                       log() && console.log('ROOM UPDATE', socketMessage.data)
                    break

                    case 'disconnectAll' :
                        localStorage.removeItem('token');
                        document.location.reload(true);
                    break

                    default:
                        const resp = await getContent()
                        dispatch({type:'programacao', payload:resp.token})
                        log() && console.log(resp)
                }
            }

            content()

        }
       

    },[socketMessage])

    useEffect( () => {

        if(programacao){
            
            log() && console.log(programacao.data.eventType, programacao.data)

            switch(programacao.data.eventType){
                case 'liveStarted' :
                    if(programacao.data.data.length === 1){
                        history.push({
                            pathname: '/liveevent',
                            url:programacao.data.data[0].url,
                            title:programacao.data.data[0].title,
                            id:programacao.data.data[0].id,
                            live:0
                        })
                    }else{
                        history.push({
                            pathname: '/lobby',
                        })
                    }
                break

                case 'quizStarted' :

                    if(_.isString(programacao.data.data)){
                        toast('Você ja jogou, aguarde os próximos conteúdos', {type: toast.TYPE.SUCCESS, transition: Flip})
                        history.push({
                            pathname: '/idle',
                        })
                    }else if(programacao.data.data.nome === 'Pesquisa'){
                        history.push({
                            pathname: '/pesquisa',
                        })
                    }else{
                        history.push({
                            pathname: '/quiz',
                        })
                    }
                break

                case 'assocStarted' :
                    history.push({
                        pathname: '/associacao',
                    })
                break

                case 'idle' :
                    history.push({
                        //pathname: '/idle',
                        pathname: '/idle',
                    })
                break

                case 'ranking' :
                    history.push({
                        //pathname: '/idle',
                        pathname: '/ranking',
                    })
                break

                case 'disconnectAll' :
                    localStorage.removeItem('token');
                    document.location.reload(true);
                break
            }
        }
      
        
    },[programacao])

    const getContent = () => {
        return getServer('api/events/now', token)
    }

    useEffect(() => {
        if(mensagem){
            switch(mensagem.type){
                case 'info' :
                    toast(mensagem.text, {type: toast.TYPE.INFO, className: 'rotateY animated'})
                return

                case 'achieve' :
                    toast(mensagem.text, {type: toast.TYPE.SUCCESS, transition: Flip})
                return

                case 'error' :
                    toast(mensagem.text, {type: toast.TYPE.ERROR, transition: Slide})
                return
            }
        }

    },[mensagem])

    useEffect( () => {
        log() && console.log('try login', logged, token)
        if(logged){
             var decoded = jwtDecode(token);
             dispatch({type:'userdata', payload:decoded})
             setUserId(decoded.id)
             log() && console.log('logged', decoded)
             setNome(decoded.nome)
             
            async function content() {

                const resp = await getContent()

                if(!resp.token){
                    log() && console.log("SERVIDOR OFFLINE")
                    alert('OFFLINE')
                    return
                }

                if(resp.token.status>299){
                    alert('token error')
                }

                if(!resp.val && resp.token.status === 401 ){
                    log() && console.log('não autenticado 401')
                    localStorage.removeItem('token');
                    document.location.reload(true);
                }else if(!resp.val && resp.token.status === 404){
                    log() && console.log('sem conteudo 404')
                    alert('sem conteudo 404')
                }else if(!resp.val && resp.token.status === 500){
                    alert('servidor limpo 500')
                    log() && console.log('servidor limpo 500')
                    localStorage.removeItem('token');
                    document.location.reload(true);
                }else{
                    log() && console.log('conteúdo:', resp.token.data.eventType)
                    dispatch({type:'programacao', payload:resp.token})
                }
                
            }
            content()
            
         }else if(logged !== false){
             !save && 
             history.push({
                 pathname: '/login',
             })
         }

    },[logged])


    

    

    /*const startConnection = async () => {

        try {
            await hubConnection.start().then(a => {
               
                console.log("connected");
              }); 
            
        } catch (err) {
            console.log(err);
           // setTimeout(() => startConnection(), 5000);
        }
       
    }*/

    const libera = () => {
        setSave(false)
        history.push({
            pathname: '/login',
        })
    }


    return (
        <div>
        {save?<div><div className={'savethedate'} style={{position: 'absolute'}} /><div onClick={libera} style={{position:'absolute', bottom:2, left:2}}>A</div></div>:
        <div style={{height:ridiculo?40:'100%'}}>
        <ToastContainer position="top-center"/>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', backgroundColor:'#25044f', justifyContent:'center', height:'100%'}}>
            <div className='containerFix' style={{ height:'100%', width:mobile?300:1127}}>
                <div style={{ marginLeft:mobile?0:20, marginRight:mobile?0:20, marginTop:ridiculo?10:20, marginBottom:ridiculo?10:20, height:'100%' }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignContent:'center', alignItems:'center', height:'100%'}}>
                        <div style={{ marginRight:mobile?50:0, height:mobile?30:'100%', alignSelf:'center'}}>
                            {/*<Image src={location.pathname === '/login'?'/images/logo_convencao2.png':'/images/logo_convencao.png'} style={{height:'50%'}}/>*/}
                            <Image src='/images/logo_convencao.png' style={{height:'50%'}}/>
                        </div>
                        <div style={{ height:mobile?20:'100%'}}>
                            <Image src='/images/logo_multilaser.png' style={{height:'50%'}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {logged?(
            <div style={{display:'flex', backgroundColor:'#050716', justifyContent:'center', lineHeight:.1}}>
                <div className='containerFix' style={{display:'flex', backgroundColor:'#050716', justifyContent:'flex-end', marginTop:5}}> 
                    <div style={{position:'relative', bottom:-10, fontSize:mobile?12:16, fontFamily:'Effra Medium', color:'#353b7c', marginRight:10}}>Olá <b>{nome}</b></div>
                </div>
            </div>
            ):
        (!_.isNil(logged)? <div>Aguardando validação do token</div>:<span><br/></span>)}
         </div>}
         </div>
        )
       
}