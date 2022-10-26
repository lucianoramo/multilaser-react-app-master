import React, {useEffect, useState, useRef, useContext} from 'react';
import { Icon, Image } from 'semantic-ui-react'
import { useHistory, useLocation, } from "react-router-dom";
import ReactPlayer from "react-player"
import _ from 'lodash';

import {
  Button,
  Form,
  Input,
} from 'formik-semantic-ui';

import { useSpring, animated } from 'react-spring'
/*import Lottie from 'react-lottie-player'
import loader from '../lottie/9965-loading-spinner.json'*/

import { Dispatch, postServer, log } from './../hooks/hooks';

export const LiveEvent = () =>  { 

const mobile = window.innerWidth<500?true:false
const [muted, setMuted] = useState(mobile?true:false)
const [width, setWidth] = useState(null)
const [orientation, setOrientation] = useState(null)
const [soUma, setSoUma] = useState(true)

const data = useLocation()
const history = useHistory();
const targetRef = useRef();

const [formanim, setformanim] = useSpring(() => ({ opacity: 0 }));

const [perguntaErro, setPerguntaErro] = useState('')

const reducer = useContext(Dispatch)
const [{ programacao, hub, userdata, salas, token }] = reducer;

const [moderador, setModerador] = useState(false)

const [staff, setStaff] = useState(false)

const ridiculo = window.innerHeight<700?true:false

const timerToClearSomewhere = useRef(false)

const defaultProps = {
  pergunta:''
}

useEffect(() => { 
  log() && console.log('url:', data.url, data.title)
  setformanim({from: {y: window.innerHeight, opacity:0}, to:{y: 0, opacity:1}})

    if(!data.url){
      history.push({
        pathname: '/lobby',
      })
    }

    log() && console.log(targetRef)
    targetRef.current.width = 100

    window.addEventListener('orientationchange', setScreenOrientation);
    window.addEventListener('resize', handleWindowSizeChange);
    setWidth(window.innerWidth); 

    /*if (!window.YT) { // If not, load the script asynchronously
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
  
        // onYouTubeIframeAPIReady will load the video after the script is loaded
        window.onYouTubeIframeAPIReady = loadVideo;
  
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      } else { // If script is already there, load the video directly
        loadVideo();
      }*/

      return () => {
        clearTimeout(timerToClearSomewhere.current)
        window.removeEventListener('resize', handleWindowSizeChange);
        window.removeEventListener('orientationchange', setScreenOrientation);
      }
}, [])

useEffect( () => {
  log() && console.log(programacao, hub, userdata)
  if(programacao && hub && userdata){
    let teste = 'null'
    if(programacao.data.data){
      postLiveNow()
      if(programacao.data.data.length > 1){
        setSoUma(false)
      }

      if(userdata.nome.toLowerCase() === 'staff'){
        setStaff(true)
      }
      
      if(programacao.data.data[data.live]){
        changeSala(true, data.id)
        //console.log(programacao.data.data[data.live].email)
        if(programacao.data.data[data.live].moderador){
          setModerador(true)
        }
      }
    }

  }
},[programacao, hub, userdata])

const changeSala = (enter, id) => {
 // console.log('send socket', userdata.id, id.toString())
 if(id){
  hub.send(enter?"EnterLiveRoom":"LeaveLiveRoom", userdata.id.toString(), id.toString()).then(resposta => {
      //console.log(resposta)
    }).catch( err => {
      console.log(err)
    })
  }
}

const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  const setScreenOrientation = () => {

    if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation('landscape');
      }else{
        setOrientation('portrait');
      }
  };

  const toggleMute = () => {

      if(muted){
       // playerVideo.unMute()
        setMuted(false)
      }else{
       // playerVideo.mute()
        setMuted(true)
      }
  }

  const toggleWidth = () => {
    if(mobile){
      return {height:'230px', width:'100%'}
    }else{
      return {height:'600px', width:'100%'}
    }
}

const _handleSubmit = async (e, setFieldValue) => {
  enviaEmail(e.pergunta, setFieldValue.setFieldValue?setFieldValue.setFieldValue:setFieldValue)
 };

 const enviaEmail = async (pergunta, setFieldValue) => {
  if(pergunta === ''){
    setAviso('A pergunta não pode estar em branco!')
  }else{
    setAviso('Pergunta enviada!')
    await postServer('api/mail/send', {destinatario:programacao.data.data[data.live].moderador, mensagem:pergunta})
    setFieldValue('pergunta', '')
  }
 }

 const setAviso = (texto) => {
  setPerguntaErro(texto)

  timerToClearSomewhere.current = setTimeout(() => {
    setPerguntaErro('')
  }, 3000);
 }

 const voltarMenu = () => {
  changeSala(false, data.id)
  setTimeout(() => {
    history.push({
      pathname: '/lobby',
    })
  },500)
  
 }

 useEffect(() => {
  log() && console.log(salas)
  
 },[salas])

 const postLiveNow = () => {
    postServer('api/events/report/live', {resourceName:data.title}, token)
 }



    return (
      <div className='topMost'>
      <div className='containerFix'>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:ridiculo?10:20, marginBottom:10}}  >
          <div>
        {!soUma &&  <Image onClick={ voltarMenu } src='/images/btn_voltar.png' style={{height:ridiculo?30:40, marginLeft:mobile && 10}}/>}
        </div>
        {staff && <div style={{fontSize:22, marginTop:10, marginRight:10, fontFamily:'Effra Medium', color:'#00ff00'}}><Icon style={{fontSize:22}} name={'users'}></Icon> {_.get(salas, data.id, 'default').pessoas}</div>}
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', position:'relative'}}>

            <div className={mobile?'player-wrapper':''}>
                <ReactPlayer
                  ref={targetRef}
                  className={mobile?'react-player':''}
                  url={data.url && (data.url.length !== 9?"https://vimeo.com/event/":"https://vimeo.com/") +data.url}
                  config={{
                    vimeo: {
                      playerOptions: { loop:1, autopause:0, autoplay:1, playsinline:1, controls:1, background:1 }
                    },
                  }}
                 // style="background-color: #FFFFFF"
                  width={mobile?'100%':890}
                  height={mobile?'100%':423}
                  muted={muted}
                  volume={1}
                 />
            </div>
            {muted && ( <div style={{display:'flex', position:'absolute'}} ><Icon name={'mute'} size={'huge'} circular bordered inverted onClick={() => toggleMute()}></Icon></div>)}
            
               
        </div>
        {moderador && (<div style={{display:'flex', justifyContent:'center'}}>
             
                <div style={{textAlign:"left", color:'white', justifyContent:'center', width:'100%', marginTop:25}}>
                    <div>
                        <Form
                            initialValues={defaultProps}
                            //validationSchema={LoginSchema}
                            onSubmit={_handleSubmit}
                            render={({ handleReset, setFieldValue, values }) => (

                              <Form.Children>
                              <div style={{display:'flex', flexDirection:!mobile?'row':'column', justifyContent:'space-between', marginBottom:mobile?0:20}}>
                                  <div style={{width:!mobile?'80%':'100%',  marginRight:10}}>
                                      <Input name="pergunta" inputProps={{placeholder:'Perguntas, dúvidas, comentários. Escreva aqui'}}/>
                                      <div style={{height:20}} className="sui-error-message">{perguntaErro}</div>
                                  </div>
                                 
                                  <div style={{display:'flex', justifyContent:'flex-end'}} onClick={ e => _handleSubmit(values, setFieldValue, e)} >
                                      <Image src='/images/btn_enviar.png' style={{height:40}}/>
                                  </div>
                              </div>
                          </Form.Children>
                        )}
                        />
                        
                    </div>
                </div>
              
          </div>)
        }     
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', marginBottom:70}}>
          {!muted && ( <div style={{color:'white', zIndex:0}} ><br/><Icon name={'unmute'} size={'large'} onClick={() => toggleMute()}></Icon></div>)}
          </div>
        </div>
        
        </div>
    );
  
}

export default LiveEvent;