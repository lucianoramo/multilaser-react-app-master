import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'semantic-ui-react'
import { useSpring, animated, config  } from 'react-spring'
import * as easings from 'd3-ease'

const BtnAlternativa = ({id, selected, right, resposta, responde, answered}) => {

    const mobile = window.innerWidth<500?true:false
    const [op, setOp] = useState(0)
    const [props, setSpring] = useSpring(() => ({ scale: 1 }));

    const [{ x, y, opacity, zIndex, scale, color }, set] = useSpring(() => {
        console.log()
        return {
            scale:1,
            opacity:0,
            config:{easing: easings.easeCubic , duration:200}
        }})

    useEffect(() =>{
       setOp(1)
    }, [])

    useEffect(() =>{
        //console.log(selected)
        selected && right && set({to:async next => {
                        await next({ scale: 1.1, color: 'white' })
                        await next({ scale: 1, color: right?'green':'red' })
        }})

     }, [selected])

    function responder(){
        responde(id)
    }

    return(
        <animated.div onClick={responder} style={{scale, marginBottom:20, color:selected? color:'grey', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:selected? right?'green':'red':'#19ffff'}}>
            <div style={{margin:mobile?13:18, fontSize:mobile?12:15, color:selected? right?'green':'red':'#19ffff'}}>{resposta}</div>
        </animated.div>
    )
}

export default BtnAlternativa
