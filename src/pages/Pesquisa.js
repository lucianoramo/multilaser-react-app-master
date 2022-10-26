import React, { useState, useEffect, useContext, useRef } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { useSpring, animated, interpolate } from 'react-spring'
import { useDrag  } from 'react-use-gesture'

import { Image, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import  BtnAlternativa  from '../componentes/BtnAlternativa'
import BtnAlternativaWebPesquisa from '../componentes/BtnAlternativaWebPesquisa'
import { Dispatch, useDimensions, postServer } from '../hooks/hooks';
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


export const Pesquisa = (props) => {

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
    const [points, setPoints] = useState('')

    const [anim, setAnim] = useSpring(() => ({ x: -window.innerWidth }));
   

    useEffect( () => {

        if(programacao){
         // setIsEvent(false)

            console.log(programacao.data)

           //setState(clearState);

            if(programacao.data.eventType === 'quizStarted'){
                setIsEvent(true)
                getConfig()
            }
        }
      
        
    },[programacao])

    useEffect( () => {
      //console.log(token)
    },[token])


    useEffect(() => {
       // console.log(totalPerguntas)
        if(totalPerguntas){
            const { perguntaAtual, pergunta } = state
        
            console.log('gera pergunta', perguntaAtual, prevCount.perguntaAtual )
        
            if(!_.isNil(perguntaAtual) && perguntaAtual !== prevCount.perguntaAtual){
              console.log('new pergunta')
                getPergunta();
            }
        
            if(!_.isNil(perguntaAtual) && pergunta !== prevCount.pergunta){
              console.log('new alternativas')
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
            window.removeEventListener('resize', handleWindowSizeChange);
          }

      },[])

      const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
      };

      const getConfig = async () => {

       

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
            
            resp.push([totalPerguntas[perguntaAtual].alternativas[a].titulo, true, false, false])
    
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

      const setResposta = (r) => {
        //console.log(points + (r+1).toString(), r)
        setPoints(points + (r+1).toString())
        
        if(allRespostas[r][1] === true){
          respondidas[perguntaAtual][0] = 'check'
          respondidas[perguntaAtual][1] = 'green'
        }else{
          respondidas[perguntaAtual][0] = 'close'
          respondidas[perguntaAtual][1] = 'red'
        }

         let respClone = [...allRespostas]
          for(let i = 0; i<respClone.length; i++){
            if(respClone[i][1] === true){
             // respClone[i][2] = true
              respClone[r][2] = true
            }
            respClone[i][3] = true
          }
          setState(prev => ({ 
            ...prev,
            allRespostas:respClone
          }));
          
          setTimeout(()=>{
            changeToNextQuestion()
          },2000)
      }

      useEffect(() => {
        //console.log(points)
        if(points !== ''){
          if(perguntaAtual === totalPerguntas.length-1){
            postContent()
          }
        }
        return () => {}

      },[points])

      const changeToNextQuestion = () => {
        
            if(perguntaAtual !== totalPerguntas.length-1){
  
              console.log(perguntaAtual, totalPerguntas.length)
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

                setTimeout(()=>{
                    history.push({
                        pathname: '/idle',
                        escrito:`<div style={{color:'white', fontSize:mobile?20:22, fontFamily:'Effra Medium'}}><i>OBRIGADO POR RESPONDER A PESQUISA DE AVALIAÇÃO! COMO A PRÓXIMA ATRAÇÃO COMEÇA EM ALGUNS MINUTOS, VOCÊ GANHOU TEMPO.</i></div>
                        <br/>
                        <div style={{color:'#19ffff', fontSize:mobile?10:22, fontFamily:'Effra Medium'}}>QUER UMA DICA?</div>
                        <br/>
                        <div style={{color:'#white', fontSize:mobile?15:30, fontFamily:'Mission GT-R Condensed Italic'}}><i>PREPARE O LINK COM SEU DRINK!</i></div>`
                    })
                },5000)
  
              }
      }

      
      const postContent = () => {
        //console.log(points)
        return postServer('api/games/quiz', {score:points, gameId:programacao.data.data.id})
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
                      <BtnAlternativaWebPesquisa id={item}  right={allRespostas[item][1]} selected={allRespostas[item][2]} resposta={allRespostas[item][0]} responde={setResposta} posicao={0} answered={allRespostas[item][3]}/>
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

    return (
      <div className='topMost'>
        <div className='containerFix' ref={targetRef}>
        {token && isEvent?(
            <div >
              <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    
                      <div style={{fontSize:mobile?20:30, marginTop:30, fontFamily:'Effra Medium', color:'#a33cd8', textAlign:'center'}}><i>Pesquisa de avaliação do evento</i></div>
                    
                </div>
              </div>
                  <div style={{display:'flex', flexDirection:'column', marginTop:25, marginLeft:20, marginRight:20}}>
                    {ready && (<div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                      <div style={{height:20}}>
                          {mobile?GetIcons():<div style={{fontSize:30, fontFamily:'Effra Medium', color:'#a33cd8'}}><i>{perguntaAtual+1 + '/' + totalPerguntas.length}</i></div>}
                      </div>
                    </div>)}
                    <div style={{alignItems:'center', justifyContent:'center', marginTop:mobile?20:30, width:'100%'}}>
                        {ready && (<div style={{fontSize:mobile?15:20, width:'100%', textAlign:'center', color:'#19ffff'}}>{pergunta}</div>)}
                        {end && (<div style={{fontSize:30, fontFamily:'Effra Medium', color:'#a33cd8', marginTop:50, textAlign:'center'}}>Obrigado pela participação!</div>)}
                    </div>
                </div> 
                <div style={{backgroundColor:'transparent', marginLeft:20, marginRight:20, marginTop:mobile?20:20, justifyContent:'center' }}>
                
                {ready && mostraAlternativas()}
                    
                    {end && ( <div>
                              <div style={{position:'absolute', left:window.innerWidth/2-60, top:window.innerHeight/2-50}}>
                              <Icon 
                                name={'trophy'} // close dot-single check
                                size={'massive'}
                                style={{color:'white'}}
                              />
                              </div>
                              <div style={{position:'absolute', left:window.innerWidth/2-150, top:window.innerHeight/2-150}}>
                                <Lottie
                                  loop={true}
                                  speed={.5}
                                  animationData={sparks}
                                  play
                                  style={{ width: 300, height: 300, alignSelf: 'center' }}
                                />
                                </div>
                            </div>)}
                            <br/>

                </div>
            </div>
            
        ):<div>Aguardando token</div>}
      </div>
      </div>
    )
}