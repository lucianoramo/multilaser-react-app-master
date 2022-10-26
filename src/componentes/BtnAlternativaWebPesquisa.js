import React, { useState, useEffect, useRef } from 'react'
import { Button, Image } from 'semantic-ui-react'
import { useSpring, animated, config  } from 'react-spring'
import * as easings from 'd3-ease'
import { useDrag  } from 'react-use-gesture'

const BtnAlternativaWebPesquisa = ({id, selected, right, resposta, responde, answered}) => {

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
        console.log(selected)
        selected && set({to:async next => {
            await next({ scale: .98 })
            await next({ scale: 1 })
        }})

     }, [selected])

    function responder(){
        responde(id)
    }

    return(
        <animated.div className={'noselect'} onClick={responder} style={{display:'flex', scale, marginBottom:20}}>
            <Image verticalAlign='middle' style={{width:55, height:55}} src={'/images/alternativa.png'}/>
            <div className={selected? 'certa': ''} style={{margin:mobile?13:18, fontSize:mobile?12:20, color:'#19ffff'}}>{resposta}</div>
        </animated.div>
    )
}

export default BtnAlternativaWebPesquisa
