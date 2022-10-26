import React, {useEffect, useContext, useState, useCallback} from 'react'
import { Dispatch, log } from '../hooks/hooks';
import { useSpring, animated, interpolate } from 'react-spring'
import { useHistory, useLocation } from "react-router-dom";
import QRCode from 'qrcode.react';
import { Image } from 'semantic-ui-react';
import _ from 'lodash';

import Lottie from 'react-lottie-player'
import waiting from '../lottie/6230-loading-37-brochure.json'

export const Ranking = () => {

    const mobile = window.innerWidth<500?true:false
    const reducer = useContext(Dispatch)
    const [{token, programacao}, dispatch] = reducer;
    const [value, setValue] = useState(10)
    const onScroll = useCallback(e => console.log(e), [])

    const [anim, setAnim] = useSpring(() => ({opacity:0}));
    const [open, setOpen] = useState(null)

    const location = useLocation()

    const [xpos, setXpos] = useSpring(() => ({ bottom: 10 }));

    const [mensagem, setMensagem] = useState('Aguarde...')

    const [galera, setGalera] = useState(null)

    useEffect(() => {
        //setAnim({from: {opacity:0, position: 'absolute', right: 20, bottom: -200, backgroundColor:mobile?'transparent':'white'}, to:{opacity:1, position: 'absolute', right: 20, bottom: 60}})

    return () => {

    } 
    },[])

    useEffect( () => {

        if(programacao){

            log() && console.log(programacao.data)

            if(programacao.data.eventType === 'ranking'){
                setGalera(programacao.data.data)
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

    const getAllData = () => {
        if(galera){
            return galera.map((pessoa, index) => {
                return <div key={index} style={{backgroundColor:index%2?'#1e202e':'transparent'}}>
                            <div style={{display:'flex', justifyContent:'space-around', height:30, fontSize:18, alignItems:'center', color:index===0?'white':'#278cb5', fontFamily:'Effra Medium'}}>
                                <div style={{width:'25%'}}>{index+1}</div>
                                <div style={{width:'50%', textAlign:'left'}}>{mobile?pessoa.nome.substr(0,20):pessoa.nome}</div>
                                <div style={{width:'25%', textAlign:'left'}}>{pessoa.pontos}</div>
                            </div>
                        </div>
            })
        }else{
            return <div>Carregando pontuação</div>
        }
    }

 
    return (
        <div className='topMost' style={{flexDirection:mobile?'row':'column', alignItems:'center'}}>
            <div className='containerFix' style={{display:'flex', flexDirection:'column', textAlign:'center', alignItems:'center'}}>
                <div style={{display:'flex', justifyContent:'center', width:window.innerWidth/3, alignItems:'center', marginTop:20}}>
                      <div >
                          <Image src='/images/titulo_ranking.png' />
                      </div>
                </div>

                <div style={{width:'100%', marginTop:10}}>
                    {getAllData()}
                </div>
                
                {/*<div style={{position:'absolute', top:window.innerHeight/2}}>
                
                <Lottie
                    loop
                    speed={1}
                    animationData={loading}
                    play={true}
                    style={{ width:window.innerWidth, height:100 }}
                />
                
                </div>
                <div style={{color:'#a74be4', position:'absolute', fontSize:mobile?13:25, fontFamily:'Effra Medium', width:'50%', top:window.innerHeight/2-20, height:80}}>{mensagem}</div>
                */}
        
            </div>
       
        </div>)
}