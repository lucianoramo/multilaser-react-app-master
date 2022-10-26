import React, {useEffect, useContext, useState, useCallback} from 'react'
import { Dispatch, log } from './../hooks/hooks';
import { useSpring, animated, interpolate } from 'react-spring'
import { useHistory, useLocation } from "react-router-dom";
import QRCode from 'qrcode.react';
import { Button } from 'semantic-ui-react';
import _ from 'lodash';

import Lottie from 'react-lottie-player'
import waiting from '../lottie/6230-loading-37-brochure.json'
import aguarde from '../lottie/aguarde.json'
import loading from '../lottie/4248-loading.json'

import JsxParser from 'react-jsx-parser'

export const Aguarde = (props) => {

    const mobile = window.innerWidth<500?true:false
    const reducer = useContext(Dispatch)
    const [{token, programacao}, dispatch] = reducer;
    const [value, setValue] = useState(10)
    const onScroll = useCallback(e => log() && console.log(e), [])

    const [anim, setAnim] = useSpring(() => ({opacity:0}));
    const [open, setOpen] = useState(null)

    const location = useLocation()

    const [xpos, setXpos] = useSpring(() => ({ bottom: 10 }));

    const [mensagem, setMensagem] = useState('Aguarde...')

    useEffect(() => {
        //setAnim({from: {opacity:0, position: 'absolute', right: 20, bottom: -200, backgroundColor:mobile?'transparent':'white'}, to:{opacity:1, position: 'absolute', right: 20, bottom: 60}})
        //console.log(location.escrito)
        if(location.escrito){
            setMensagem(location.escrito)
        }

        return () => {}
    },[])

    useEffect( () => {

        if(programacao){

            log() && console.log(programacao.data.data)

            if(programacao.data.eventType === 'idle'){
                setMensagem(programacao.data.data)
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
        if(!_.isNil(open)){
            if(open){
                setAnim({from: {opacity:0, position: 'absolute', right: 20, bottom: -200, backgroundColor:mobile?'transparent':'white'}, to:{opacity:1, position: 'absolute', right: 20, bottom: 60}})
            }else{
                setAnim({from: {opacity:1, backgroundColor:mobile?'transparent':'white'}, to:{opacity:0}})
            }
        }
    },[open])

    useEffect(() => {
        log() && console.log(token, '3', location.pathname )
    },[token])

 
    return (
        <div className='topMost' style={{flexDirection:mobile?'row':'column', alignItems:'center'}}>
        <div className='containerFix' style={{display:'flex',  justifyContent:'center', color:'white', height:window.innerHeight-200}}>
            <div style={{alignSelf:'center', marginLeft:mobile?-10:-50}}>
                <Lottie
                    loop={false}
                    speed={1}
                    animationData={aguarde}
                    play={true}
                    style={{ width:window.innerWidth, height:500 }}
                />
            </div>
            <div style={{alignSelf:'center', position:'absolute'}}>
                <div style={{display:'flex', color:'#a74be4', textAlign:'center', justifyContent:'center', color:'white', fontSize:mobile?13:25, fontFamily:'Effra Medium', lineHeight:1}}>
                    <div style={{display:'flex', flexDirection:'column', alignSelf:'center', justifyContent:'center', width:'40%', marginBottom:0}}>
                        <JsxParser
                            bindings={{
                                mobile: mobile,
                            }}
                            jsx={mensagem}
                        />
                        <div style={{height:20}}>
                        <Lottie
                            loop
                            speed={1}
                            animationData={loading}
                            play={true}
                            style={{ height:100 }}
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
        </div>)
}