import React, { useState, useEffect, useRef } from 'react'
import { Button, Image } from 'semantic-ui-react'
import { useSpring, animated, config  } from 'react-spring'
import * as easings from 'd3-ease'
import { useDrag  } from 'react-use-gesture'

const BtnAlternativaWeb = ({id, selected, right, resposta, responde, answered}) => {

    const mobile = window.innerWidth<500?true:false
    const [op, setOp] = useState(0)
    const [props, setSpring] = useSpring(() => ({ scale: 1 }));

    const [{ x, y, opacity, zIndex, scale, color }, set] = useSpring(() => {
        return {
            scale:1,
            opacity:0,
            config:{easing: easings.easeCubic , duration:200}
        }})

       /* const bind = useDrag(
            ({ down, movement: [mx, my], tap }) => {
              if (tap) alert('tap!')
              //set({ x: down ? mx : 0, y: down ? my : 0 })
            },
            { filterTaps: true }
          )*/

    useEffect(() =>{
       //setOp(1)
    }, [])

    useEffect(() =>{
        selected && right && set({to:async next => {
            await next({ scale: .98 })
            await next({ scale: 1 })
        }})

     }, [selected])

    function responder(){
        responde(id)
    }

    return(
        <animated.div className={'noselect'} onClick={responder} style={{display:'flex', scale, alignItems:'center', height:65}}>
            <Image verticalAlign='middle' style={{width:55, height:55}} src={'/images/alternativa_'+id+'.png'}/>
            <div className={selected? right?'certa':'errada':'neutra'} style={{margin:13, fontSize:mobile?12:20, color:'#19ffff', lineHeight:1}}>{resposta}</div>
        </animated.div>
    )
}

export default BtnAlternativaWeb
