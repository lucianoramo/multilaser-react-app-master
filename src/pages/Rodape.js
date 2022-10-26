import React, {useEffect, useContext, useState, useCallback} from 'react'
import { Dispatch, log } from '../hooks/hooks';
import { useSpring, animated, interpolate } from 'react-spring'
import { useHistory, useLocation } from "react-router-dom";
import QRCode from 'qrcode.react';
import { Button, Image } from 'semantic-ui-react';
import _ from 'lodash';

export const Rodape = () => {

    const mobile = window.innerWidth<500?true:false
    const reducer = useContext(Dispatch)
    const [{token}, dispatch] = reducer;
    const [value, setValue] = useState(10)
    const onScroll = useCallback(e => console.log(e), [])

    const [anim, setAnim] = useSpring(() => ({opacity:0}));
    const [animAgenda, setAnimAgenda] = useSpring(() => ({opacity:0}));
    const [open, setOpen] = useState(null)

    const [openAgenda, setOpenAgenda] = useState(null)

    const location = useLocation()

    const [xpos, setXpos] = useSpring(() => ({ bottom: 10 }));

    useEffect(() => {
        //setAnim({from: {opacity:0, position: 'absolute', right: 20, bottom: -200, backgroundColor:mobile?'transparent':'white'}, to:{opacity:1, position: 'absolute', right: 20, bottom: 60}})
        window.addEventListener('scroll', handleScroll); 

    return () => {
        window.removeEventListener('scroll', handleScroll);
    } 
    },[])

    const openQRcode = () => {
        setOpen(!open)
    }

    const openMyAgenda = () => {
        setOpenAgenda(!openAgenda)
    } 

    useEffect(() => {
        if(!_.isNil(open)){
            if(open){
                setAnim({from: {opacity:0, position: 'absolute', left:  window.innerWidth/2-100, bottom: 0, backgroundColor:mobile?'transparent':'white'}, to:{opacity:1, position: 'absolute', left: window.innerWidth/2-100, bottom: window.innerHeight/2-50}})
            }else{
                setAnim({from: {opacity:1, backgroundColor:mobile?'transparent':'white'}, to:{opacity:0, left:  window.innerWidth/2-100, bottom: 0}})
            }
        }
    },[open])

    useEffect(() => {
        if(!_.isNil(openAgenda)){
            if(openAgenda){
                setAnimAgenda({from: {opacity:0, position: 'absolute', bottom: -20}, to:{opacity:1, left:0, position: 'absolute', bottom: 0}})
            }else{
                setAnimAgenda({from: {opacity:1}, to:{opacity:0, position: 'absolute', bottom: -20}})
            }
        }
    },[openAgenda])

    useEffect(() => {
        log() && console.log(token, '3', location.pathname )
    },[token])

    const handleScroll = (event) => {
        log() && console.log(window.scrollY)
        setXpos({bottom:value-window.scrollY})
    }
 
    return (
        <div>
            {location.pathname !== '/' && <div className='StickyBox' style={{ width:'100%', backgroundColor:!mobile?'#25044f':'transparent', height:60 }} onScroll={onScroll}>
                {location.pathname !== '/login' && !mobile && <div style={{color:'white', fontSize:13, display:'flex', position: 'absolute', right:10, bottom: 20, fontFamily:'Effra Medium'}}>Qualquer dúvida sobre a agenda e participação, fale com a gente pelo whatsapp: 11 99518-6030</div>}
                {/*<animated.div className={'linke'} style={{position: 'absolute', left: 10, right: 0, bottom: xpos.bottom, color:'#14193d', fontSize:12}}><a href='http://www.antidotodesign.com.br' style={{color:'#1e2452'}}>Antidoto</a></animated.div>*/}
                {!mobile && location.pathname !== '/login' &&<animated.div  style={{display:'flex', position: 'absolute', left:5, bottom: 10, zIndex:9}}><Button style={{backgroundColor:'#19ffff', color:'#25044f'}}  onClick={openQRcode}>Quer usar o celular?</Button></animated.div>}
                {location.pathname !== '/login' &&<animated.div  style={{display:'flex', position: 'absolute', left:mobile?5:'45%', bottom: 5, zIndex:10}}><Image style={{height:50, cursor:'pointer'}} onClick={openMyAgenda} onMouseOver={!mobile?openMyAgenda:console.log()} onMouseOut={!mobile?openMyAgenda:console.log()} src='/images/btn_agenda.png' /></animated.div>}
                <div style={{margin:40 , width:200, height:200}}>
                    <animated.div style={anim}><div style={{margin:10, marginTop:10, lineHeight:.7}}>{ !mobile && (<QRCode size={180} renderAs='svg' value={"http://"+window.location.hostname+"/?qrtoken="+token} />)}</div></animated.div>
                </div>

                <div>
                    {openAgenda && <animated.div style={animAgenda}><div style={{width:window.innerWidth, zIndex:1}}>{ (<div className={mobile?'coverAgendaMobile':'coverAgenda'} style={{position: 'absolute', bottom: 60}} />)}</div></animated.div>}
                </div>
            </div>}
        </div>
        )
}