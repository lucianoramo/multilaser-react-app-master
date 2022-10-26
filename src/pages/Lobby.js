import React, {useEffect, useContext, useState, useCallback, useRef} from 'react'
import { Dispatch, log } from '../hooks/hooks';
import _ from 'lodash';
import { useHistory, useLocation } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import { Image } from 'semantic-ui-react';
import { useSpring, animated, useSprings, useTransition } from 'react-spring'
import Lottie from 'react-lottie-player'

import liveAnim from '../lottie/16827-pulse-error.json'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Lobby = () => {    

    const mobile = window.innerWidth<500?true:false
    const tamanhoBola = mobile?200:300
    const reducer = useContext(Dispatch)
    const [{token, programacao}, dispatch] = reducer;
    const history = useHistory();
    const [nome, setNome] = useState('')
    const query = useQuery();

    const [isEvent, setIsEvent] = useState(false)

    const [lives, setLives] = useState([])

    const [xpos, setXpos] = useSpring(() => ({ x: 10 }));

    const springs = useSprings(lives.length, lives.map((item, index) => ({
        from: { y:500, color: '#fff', opacity: 0, alignSelf:'center', margin:mobile?10:25 },
        to: {
            color: '#fff',
            opacity:  1,
            y:0,
            cursor:'pointer'
        },
        delay:250*index
    })));

     /* const reset = useCallback(() => {
        ref.current.map(clearTimeout)
        ref.current = []
        set([])
        ref.current.push(setTimeout(() => set(['Apples', 'Oranges', 'Kiwis']), 2000))
        ref.current.push(setTimeout(() => set(['Apples', 'Kiwis']), 5000))
        ref.current.push(setTimeout(() => set(['Apples', 'Bananas', 'Kiwis']), 8000))
      }, [])
    
      useEffect(() => void reset(), [])*/

    const pulse = useSpring({
        from: { scale:.5  },
        to: async next => {
          while (1) {
            await next({ scale: .5,})
            await next({ scale: 1}) 
          }
        },
      }) 
    

    useEffect( () => {

        if(programacao){

            log() && console.log(programacao.data)

            if(programacao.data.eventType === 'liveStarted'){
                setIsEvent(true)
                setLives(programacao.data.data)
            }

           /* if(programacao.eventType === 'liveStarted'){
                setLives(programacao)
            }else if(_.has(programacao, 'quiz')){

            }*/
        }
      
        
    },[programacao])

    const goLive = (url, title, live, id) => {
        history.push({
            pathname: '/liveevent',
            url:url,
            title:title,
            live:live,
            id:id
        })
    }


    const GimmeLives = () => {
        if(lives){
            return springs.map((animation, index) => {
                return <animated.div onClick={() => goLive(lives[index].url, lives[index].title, index, lives[index].id)} key={index} style={animation}>
                            <Image src={lives[index].image} style={{width:tamanhoBola, height:tamanhoBola, objectFit:'contain' /*, borderRadius:'50%', objectFit:'cover'*/}}/>
                          
                            {/*<div style={{display:'flex', fontSize:20, marginTop:mobile?10:20, justifyContent:'center', alignItems:'center'}}>
                                {_.startCase(lives[index].title)}
                                <animated.div style={{}}>
                                    <Lottie
                                            loop
                                            animationData={liveAnim}
                                            play
                                            style={{ width: 30, height: 30 }}
                                        />
                                </animated.div>
                            </div>*/}
                            </animated.div>
            })
        }else{
            return <div>aguardando</div>
        }
    }


    return (
        <div style={{display:'flex', marginTop:5, marginLeft:15, marginRight:15, justifyContent:'center'}}>
        {token && isEvent && <div style={{textAlign:"center", color:'white'}}>
            <br/>
            <div style={{fontSize:25, fontFamily:'Effra Medium', color:'#2679d5', marginTop:mobile?10:25, lineHeight:1}}>ESCOLHA ABAIXO A LIVE QUE DESEJA ASSISTIR</div>
            <br/>
            <div style={{display:'flex', flexDirection:mobile?'column':'row', justifyContent:'center',  marginTop:mobile?10:50}}>

                {GimmeLives()}

            </div>
            <br/>
        </div>}
        </div>
        )
}

{/*<div key={index} style={{width:250}}><img className={'clipBola'} src={image}/></div>*/}