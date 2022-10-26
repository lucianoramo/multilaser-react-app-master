import React, { useState, useEffect, useContext, useRef } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { useSpring, animated, interpolate } from 'react-spring'
import { useDrag  } from 'react-use-gesture'

import { Image, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import  BtnAlternativa  from '../componentes/BtnAlternativa'
import BtnAlternativaWeb from '../componentes/BtnAlternativaWeb'
import { Dispatch, useDimensions, useStopwatch, postServer, log } from './../hooks/hooks';
import { useHistory, useLocation } from "react-router-dom";
import QRCode from 'qrcode.react';

import Lottie from 'react-lottie-player'
import timer from '../lottie/6722-loading.json'
import sparks from '../lottie/26892-star-burst-animation.json'

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


export const Quiz = (props) => {

    const myElement = document.querySelector('body');
    const targetRef = useRef();
    const size = useDimensions(targetRef);
    
    const [isEvent, setIsEvent] = useState(false)

    const mobile = window.innerWidth<500?true:false
    const [width, setWidth] = useState(null)

    const reducer = useContext(Dispatch)
    const [{ token, programacao }, dispatch] = reducer;
    const history = useHistory();

    const clearState = {
      end:false, 
      pergunta:null, 
      allRespostas: null, 
      totalPerguntas: null, 
      perguntaAtual: null, 
      ready: null, 
      respondidas: null
    }

    const [state, setState] = useState(clearState);
    const { pergunta, allRespostas, totalPerguntas, perguntaAtual, ready, respondidas, end } = state
    const prevCount = usePrevious(state)

    const [anim, setAnim] = useSpring(() => ({ x: -window.innerWidth }));

    
      const {
        setInicial,
        setInverse,
        laps,
        addLap,
        isRunning,
        elapsedTime,
        startTimer,
        stopTimer,
        resetTimer,
      } = useStopwatch();

      const calc = (x, y) => [-(y - window.innerHeight / 2) / 40, (x - window.innerWidth / 2) / 40, 1.1]
      const trans = (x, y, s) => `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
      const [propes, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))

      const calc2 = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2]
      const trans1 = (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`
      const [propis, set2] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }))

  
      const [points, setPoints] = useState(null)

      const [opcao, setOpcao] = useState({aparece:false, certo:true});

    

    useEffect( () => {

        if(programacao){
         // setIsEvent(false)

         log() && console.log(programacao.data)

           //setState(clearState);

            if(programacao.data.eventType === 'quizStarted'){
                setIsEvent(true)
                getConfig()
                /*
                setState(prev => ({ 
                  ...prev,
                  end:true,
                  ready:false
                }));
                */
              
            }
        }
      
        
    },[programacao])

    useEffect(() => {
      //console.log(points)
     /* if(points){
        if(perguntaAtual === totalPerguntas.length-1){
          postContent()
        }
      }*/
      return () => {}

    },[points])

    useEffect( () => {
      //console.log(token)
    },[token])


    useEffect(() => {
       // console.log(totalPerguntas)
        if(totalPerguntas){
            const { perguntaAtual, pergunta } = state

            if(!_.isNil(perguntaAtual) && perguntaAtual !== prevCount.perguntaAtual){
                getPergunta();
            }
        
            if(!_.isNil(perguntaAtual) && pergunta !== prevCount.pergunta){
                getAlternativas(perguntaAtual)
            }
           // console.log( 'CHANGED: ', state/*, prevCount*/ )

            if(!_.isNil(perguntaAtual) && allRespostas === prevCount.allRespostas ){
                setAnim({from: {x: -window.innerWidth}, to:{x: 0}})
            }
        }
        
      },[state])
    
      useEffect(() => {

        window.addEventListener('resize', handleWindowSizeChange);
        setWidth(window.innerWidth);

        return () => {
            //stopTimer()
            window.removeEventListener('resize', handleWindowSizeChange);
          }

      },[])

      useEffect(() => {

        if(elapsedTime <= 0 && ready){
          setState(prev => ({ 
            ...prev,
            end:true,
            ready:false
          }));

          stopTimer();

          calculatePoints()

          setTimeout(()=>{
              history.push({
                  pathname: '/idle',
                  escrito:`<div style={{color:'white', fontSize:mobile?20:40, fontFamily:'Mission GT-R Condensed Italic'}}><i>ESTE MULTIDESAFIO ACABOU.</i></div>
                        <br/>
                        <div style={{color:'#19ffff', fontSize:mobile?10:20, fontFamily:'Effra Medium'}}>MANTENHA-SE ONLINE QUE UMA NOVA RODADA DE CONTEÚDO JÁ VAI COMEÇAR</div>`
              })
          },8000)
        }

        return () => {

        }

      },[elapsedTime])

      const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
      };

      const getConfig = async () => {

        setInicial(programacao.data.data.tempo*60);
        setInverse(true);

        setTimeout(() => {
          startTimer()
        },1000)

      //  console.log('CONFIG', programacao.data.data.perguntas.length)
        return new Promise((resolve)=> {
           let values = []
          
              _.times(programacao.data.data.perguntas.length, () => values.push(['circle', '#19ffff']))
             // console.log( 'SET PERGUNTA')
    
              setState(prev => ({ 
                ...prev,
                respondidas:values,
                totalPerguntas:programacao.data.data.perguntas,
                perguntaAtual: 0
            }));
              resolve()
          })
      }

      const getPergunta = () => {
       // console.log('PERGUNTA ---------------------')
       // console.log('PEGA PERGUNTA', totalPerguntas[perguntaAtual])
        setState(prev => ({ 
            ...prev,
            pergunta:totalPerguntas[perguntaAtual].titulo
        }));
      }

      const getAlternativas = (perguntaAtual) => {
       // console.log('RESPOSTAS --------------------')
        const resp = []

       for(let a = 0; a<totalPerguntas[perguntaAtual].alternativas.length; a++){
            
            resp.push([totalPerguntas[perguntaAtual].alternativas[a].titulo, Number(totalPerguntas[perguntaAtual].resposta) === a?true:false, false, false])
    
           // console.log('POPULA RESPOSTA CERTA', resp)
    
            if(resp.length === totalPerguntas[perguntaAtual].alternativas.length-1){
              //console.log('POPULA RESPOSTA', resp)
              setState(prev => ({ 
                ...prev,
                allRespostas:resp,
                ready:true
              }));

            }
        }
      }

      const setResposta = (r, select) => {
       // console.log('RESPONDENDO')
        
        if(allRespostas[r][1] === true){
          setOpcao({certo:true, aparece:true})
          respondidas[perguntaAtual][0] = 'check'
          respondidas[perguntaAtual][1] = 'green'
        }else{
          setOpcao({certo:false, aparece:true})
          respondidas[perguntaAtual][0] = 'close'
          respondidas[perguntaAtual][1] = 'red'
        }

         let respClone = [...allRespostas]
          for(let i = 0; i<respClone.length; i++){
            if(respClone[i][1] === true){
              respClone[i][2] = true
              respClone[r][2] = true
            }
            respClone[i][3] = true
          }
          setState(prev => ({ 
            ...prev,
            allRespostas:respClone
          }));
          
          changeToNextQuestion()
        
      }

      const changeToNextQuestion = () => {
        setTimeout(()=>{

          setOpcao({certo:false, aparece:false})

            if(perguntaAtual !== totalPerguntas.length-1){
  
              log() && console.log(perguntaAtual, totalPerguntas.length)
             // if(perguntaAtual !== 3){
                setState(prev => ({ 
                  ...prev,
                  perguntaAtual:perguntaAtual+1
                }));
  
              }else{
                setState(prev => ({ 
                  ...prev,
                  end:true,
                  ready:false
                }));

                stopTimer();

                calculatePoints()
      
                setTimeout(()=>{
                    history.push({
                        pathname: '/idle',
                        escrito:`<div style={{color:'white', fontSize:mobile?20:40, fontFamily:'Mission GT-R Condensed Italic'}}><i>ESTE MULTIDESAFIO ACABOU.</i></div>
                        <br/>
                        <div style={{color:'#19ffff', fontSize:mobile?10:20, fontFamily:'Effra Medium'}}>MANTENHA-SE ONLINE QUE UMA NOVA RODADA DE CONTEÚDO JÁ VAI COMEÇAR</div>`
                    })
                },8000)
  
              }
            
          },2000)
      }

      const calculatePoints = async () => {
        let acertos = 0;
        let pontuacao = 0;
        for(let i = 0; i<respondidas.length; i++){
          if(respondidas[i][1] === 'green'){
            acertos++
          }
        }

        if(acertos !== 0){
          pontuacao = acertos * Number(elapsedTime)
        }

        log() && console.log(acertos, Number(elapsedTime), pontuacao)

        setPoints({pontuacao:pontuacao, acertos:acertos, respondidas:respondidas.length})
        let resposta = await postContent(pontuacao)
        log() && console.log(resposta)
      }

      const postContent = (pontuacao) => {
        return postServer('api/games/quiz', {score:pontuacao.toString(), gameId:programacao.data.data.id})
      }

      const mostraAlternativas = () => {
       // console.log('BOTOES')
       if(mobile){
          return allRespostas.map((resp, item) => {
            return <animated.div key={item} style={anim}>
                      <BtnAlternativa id={item}  right={allRespostas[item][1]} selected={allRespostas[item][2]} resposta={allRespostas[item][0]} responde={setResposta} posicao={0} answered={allRespostas[item][3]}/>
                  </animated.div>
          })
        }else{
          return allRespostas.map((resp, item) => {
            return <animated.div key={item} style={anim}>
                      <BtnAlternativaWeb id={item}  right={allRespostas[item][1]} selected={allRespostas[item][2]} resposta={allRespostas[item][0]} responde={setResposta} posicao={0} answered={allRespostas[item][3]}/>
                  </animated.div>
          })
        }
      }
    
      const GetIcons = () => {
        //console.log('ICONS')
        return respondidas.map((dot, index) => {
          return <Icon 
            key={index}
            name={dot[0]} // close dot-single check
           // color={dot[1]}
            size={dot[0] !== 'circle'?'big':'small'}
            style={{width:30, textAlign:'center', color:dot[1]}}
          />
          
        })
      }
    
      const displayTimeLeft = seconds => {
        let minutesLeft = Math.floor(seconds/60) ;
        let secondsLeft = seconds % 60;
        minutesLeft = minutesLeft.toString().length === 1 ? "0" + minutesLeft : minutesLeft;
        secondsLeft = secondsLeft.toString().length === 1 ? "0" + secondsLeft : secondsLeft;
        return `${minutesLeft}:${secondsLeft}`;
    }

    return (
      <div className='topMost' style={{flexDirection:mobile?'row':'column', alignItems:'center'}}>
        <div className='containerFix' ref={targetRef}>
        {token && isEvent?(
            <div >
              <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{width:window.innerWidth/3}}></div>
                <div style={{display:'flex', justifyContent:'center', width:window.innerWidth/3, alignItems:'center'}}>
                      <div >
                          <Image src='/images/titulo_quiz.png' />
                      </div>
                </div>
                
                <Lottie
                      loop
                      speed={.5}
                      animationData={timer}
                      play
                      style={{ display:'flex', width:window.innerWidth/3, height:mobile?100: 150, position:'relative' }}
                  >
                  <div style={{fontSize:mobile?15:18, color:'#19ffff', position:'absolute', width:'100%', top:'42%', textAlign:'center'}} ><i>{displayTimeLeft(Math.round(elapsedTime))}</i></div>
                </Lottie>

              
              </div>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    {ready && (<div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <div style={{height:20}}>
                        
                        {mobile?GetIcons():<div style={{fontSize:30, fontFamily:'Effra Medium', color:'#a33cd8'}}><i>{perguntaAtual+1 + ' / ' + totalPerguntas.length}</i></div>}
                        
                    </div>
                </div>)}
                    <div style={{alignItems:'center', justifyContent:'center',marginLeft:20, marginRight:20, marginTop:mobile?20:30}}>
                       
                        {ready && (<span style={{fontSize:mobile?15:20, textAlign:'center', color:'#19ffff'}}>{pergunta}</span>)}
                        
                    </div>
                </div> 
                <div style={{backgroundColor:'transparent', marginLeft:20, marginRight:20, marginTop:20, justifyContent:'center', marginBottom:100 }}>
                
                {ready && mostraAlternativas()}

                

                {!mobile && !end && <div style={{display:'flex', justifyContent:'center', width:'100%', height:50, alignItems:'center', marginTop:100, marginBottom:100}}>
                      {opcao.aparece && <div>
                          <Image src={'/images/'+ (opcao.certo?'certo':'errado')+'.png'} />
                      </div>}
                </div>}

                
                    
                    {end && ( 
                    <div style={{height:'100%'}}>
                      <div onMouseMove={({ clientX: x, clientY: y }) => set2({ xy: calc2(x, y) })}>
                      <animated.div
                        onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
                        onMouseLeave={() => set({ xys: [0, 0, 1] })}
                        style={{ display: 'flex', flexDirection:'column', transform: propes.xys.interpolate(trans), justifyContent:'center' }}
                      >
                        <div>
                              <div style={{display: 'flex', position:'absolute', width:'100%', justifyContent:'center'}}>
                                
                                  <animated.div style={{ transform: propis.xy.interpolate(trans1), justifyContent:'center' }} >
                                    <Lottie
                                      loop={1}
                                      speed={.5}
                                      animationData={sparks}
                                      play
                                      style={{ width: 350, height: 350 }}
                                    />
                                    </animated.div>
                                  
                                </div>
                    </div>
                        <Image src='/images/over_ponto.png' />
                        {end &&  points && (
                          <div style={{display: 'flex', position:'absolute',  alignSelf:'center', justifyContent:'center', fontSize:30, fontFamily:'Effra Medium', color:'#4594c7', width:'100%', textAlign:'center'}}>
                            Parabéns! Você acertou {Math.round((points.acertos*100) / points.respondidas)} %
                          </div>)}
                      </animated.div>
                      </div>
                    </div>
                    )}
                </div>
            </div>
            
        ):<div>Aguardando token</div>}
      </div>
      
      </div>
    )
}