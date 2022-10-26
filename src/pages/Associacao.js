import React, {useEffect, useContext, useState, useRef } from 'react'
import { Dispatch, useDimensions, log } from '../hooks/hooks';
import _ from 'lodash';
import { useHistory, useLocation } from "react-router-dom";
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import { useSpring, animated, interpolate } from 'react-spring'
import { useDrag  } from 'react-use-gesture'

import { Image } from 'semantic-ui-react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

export const Associacao = () => {

   // const ballSize = 140;
    const marginBall = 10;

    const mobile = window.innerWidth<500?true:false

    const [ballSize, setBallSize] = useState(mobile?100:140)

    const targetRef = useRef();
    const [dim, setActiveDim] = useState(true)
    const size = useDimensions(targetRef, dim);

    const reducer = useContext(Dispatch);
    const [{ mensagem, programacao }, dispatch] = reducer;
   // const [{token, validated}, dispatch] = reducer;
    const history = useHistory();

    const query = useQuery();
    //const [{logged, validate}] = useValidateToken({token, qrtoken:query.get("qrtoken"), dispatch});
    const [width, setWidth] = useState(null)

    const [charged, setCharged] = useState(false)
 
    const staticGame = [
        {conteudo:'', x:marginBall,y:0, id:'red', color:'#2679d5'},
        {conteudo:'', x:size.width-marginBall-ballSize,y:0, id:'yellow', color:'#2679d5'},
        {conteudo:'', x:marginBall,y:ballSize+marginBall, id:'green', color:'#2679d5'},
        {conteudo:'', x:size.width-marginBall-ballSize, y:ballSize+marginBall, id:'blue', color:'#2679d5'},
        {conteudo:'', x:marginBall,y:ballSize*2+marginBall*2, id:'blue', color:'#2679d5'},
        {conteudo:'', x:size.width-marginBall-ballSize,y:ballSize*2+marginBall*2, id:'green', color:'#2679d5'},
        {conteudo:'', x:marginBall,y:ballSize*3+marginBall*3, id:'yellow', color:'#2679d5'},
        {conteudo:'', x:size.width-marginBall-ballSize,y:ballSize*3+marginBall*3, id:'red', color:'#2679d5'}
    ]

    const [positions, setPositions] = useState(staticGame)

    const traco = useSpring({
        from: { width:'1px', height:0, position:'absolute', left:'50%', backgroundColor:'#2679d5' },
        to: { width:'1px', height:positions[7].y+ballSize, position:'absolute', left:'50%', backgroundColor:'#2679d5'},
        config: { duration: 1000 }
    })

// -----------------------------------------------------------------------------------------------
    const [{ x : x0, y : y0, opacity:opacity0, zIndex:zIndex0 }, set0] = useSpring(() => {
        return {
            x: positions[0].x, 
            y: positions[0].y , 
            from:{x:-100},
            opacity:0,
        }})
    const bind0 = useDrag(({ down, initial, movement: [mx, my], cancel }) => {
        if(!down) verifyRight(initial, mx, my, 0)
       // if (mx > size.width-marginBall-ballSize) { cancel();}
        set0({ x: down ? mx+marginBall : marginBall, y: down ? my+positions[0].y : positions[0].y, zIndex: '1'})
    })
    const [{ x : x1, y : y1, opacity:opacity1 }, set1] = useSpring(() => {
        return {
            x: positions[1].x, 
            y: positions[1].y ,
            opacity:0 
        }
    })
// -----------------------------------------------------------------------------------------------
const [{ x : x2, y : y2, opacity:opacity2, zIndex:zIndex2 }, set2] = useSpring(() => {

    return {
        x: positions[2].x, 
        y: positions[2].y , 
        from:{x:-100},
        opacity:0
    }})
const bind2 = useDrag(({ down, initial, movement: [mx, my], cancel }) => {
    if(!down) verifyRight(initial, mx, my, 2)
   //if (mx > size.width-marginBall-ballSize) { cancel();}
    set2({ x: down ? mx+marginBall : marginBall, y: down ? my+positions[2].y : positions[2].y, opacity:1, zIndex: '1' })
})
const [{ x : x3, y : y3, opacity:opacity3 }, set3] = useSpring(() => {
    return {
        x: positions[3].x, 
        y: positions[3].y , 
        from:{x:size.width},
        opacity:0
    }
})
// -----------------------------------------------------------------------------------------------
const [{ x : x4, y : y4, opacity:opacity4, zIndex:zIndex4 }, set4] = useSpring(() => {
    return {
        x: positions[4].x, 
        y: positions[4].y , 
        from:{x:-100},
        opacity:0
    }})
const bind4 = useDrag(({ down, initial, movement: [mx, my], cancel }) => {
    if(!down) verifyRight(initial, mx, my, 4)
    //if (mx > size.width-marginBall-ballSize) { cancel();}
    set4({ x: down ? mx+marginBall : marginBall, y: down ? my+positions[4].y : positions[4].y, opacity:1, zIndex: '1' })
})
const [{ x : x5, y : y5, opacity:opacity5 }, set5] = useSpring(() => {
    return {
        x: positions[5].x, 
        y: positions[5].y , 
        from:{x:size.width},
        opacity:0
    }
})
// -----------------------------------------------------------------------------------------------
const [{ x : x6, y : y6, opacity:opacity6, zIndex:zIndex6 }, set6] = useSpring(() => {
    return {
        x: positions[6].x, 
        y: positions[6].y , 
        from:{x:-100},
        opacity:0
    }})
const bind6 = useDrag(({ down, initial, movement: [mx, my], cancel }) => {
    if(!down) verifyRight(initial, mx, my, 6)
    //if (mx > size.width-marginBall-ballSize) { cancel();}
    set6({ x: down ? mx+marginBall : marginBall, y: down ? my+positions[6].y : positions[6].y, opacity:1, zIndex: '1' })
})
const [{ x : x7, y : y7, opacity:opacity7 }, set7] = useSpring(() => {
    return {
        x: positions[7].x, 
        y: positions[7].y , 
        from:{x:size.width},
        opacity:0
    }
})
// -----------------------------------------------------------------------------------------------

    const verifyRight = (initial, mx, my, index) => {

       if(mx>(size.width-ballSize-marginBall-ballSize/1.5)){
        let newArray = [];

            for(var i=0; i<positions.length; i++){
                let ypslon = my<0?Math.abs(Math.abs(my) - positions[index].y):Math.abs(my + positions[index].y)
                newArray.push({x:Math.abs(positions[i].x-mx) , y:Math.abs(positions[i].y-ypslon) , id:positions[i].id, index:i})
            }

            newArray.sort(function (a, b) {
                let num = a.y - b.y || a.x - b.x;
                return num
            });
        
            if(newArray[0].x<50 && newArray[0].y<20){

                if(newArray[0].id === positions[index].id){

                    let newPositions = _.clone(positions)


                    newPositions[newArray[0].index].color = '#272727'
                    newPositions[index].color = '#272727'

                    setPositions(newPositions)

                    let cont = 0;
                    for(var i=0; i<positions.length; i++){
                        newPositions[i].color === '#272727' && cont++
                        console.log(positions.length,cont)
                        positions.length === cont && dispatch({type:'mensagem', payload:{text:'Parabéns! Você completou o jogo', type:'achieve'}})
                    }
                }

          }else{
            log() && console.log('nada')
          }

          
        }else{
            log() && console.log('chega mais perto')
        }

        

    }

    useEffect( () => {

        log() && console.log(programacao, size)

        if( programacao && size ){

            log() && console.log(programacao.data)

            if(programacao.data.eventType === 'assocStarted'){
                log() && console.log('entrou')
                //setIsEvent(true)
                //getConfig()
                criaJogo()
            }else{
                
            }

        }

    },[programacao, size])

    const criaJogo = () => {
        setActiveDim(false)
        log() && console.log('criando')

        if(size.width>0){
            if(size.width>500){
                log() && console.log('desk')
                setBallSize(140)
            }else{
                log() && console.log('mobile')
                setBallSize(100)
            }

        let staticData = staticGame
        let conteudos = programacao.data.data.associacoes

        for(let i=0; i<8; i++){
            staticData[i].conteudo = conteudos[i].conteudo
            staticData[i].id = conteudos[i].id
        }

        setPositions(staticData)

        let corX = size.width-marginBall-ballSize
        set0({ opacity:1, x:marginBall, from:{x:-ballSize} })
        set1({ x:corX , y: positions[1].y, opacity:1, from:{x:corX+ballSize}, delay:100 })
        set2({ opacity:1, delay:200, x:marginBall, from:{x:-ballSize} })
        set3({ x:corX , y: positions[3].y, opacity:1, from:{x:corX+ballSize}, delay:200 })
        set4({ opacity:1, delay:300, x:marginBall, from:{x:-ballSize} })
        set5({ x:corX , y: positions[5].y, opacity:1, from:{x:corX+ballSize}, delay:300 })
        set6({ opacity:1, delay:400, x:marginBall, from:{x:-ballSize} })
        set7({ x:corX , y: positions[7].y, opacity:1, from:{x:corX+ballSize}, delay:400 })
    }
    }
 

    useEffect( () => {
      
       // dispatch({type:'mensagem', payload:{text:'Bem vindo ao jogo de associação!', type:'info'}})
        var myElement = document.querySelector('body');
        myElement.style.userSelect = 'none';
        //setTargetElement(document.querySelector('#targetElementId'));
        disableBodyScroll(myElement);
        
        window.addEventListener('resize', handleWindowSizeChange);
        setWidth(window.innerWidth);

        return () => {
            clearAllBodyScrollLocks();
            window.removeEventListener('resize', handleWindowSizeChange);
          }
    },[])



    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    };

     


    return (
        <div className='topMost'>
        <div className='containerFix' ref={targetRef}>
            <div >
                <div>
                    <div style={{display:'flex', justifyContent:'center', marginLeft:10, marginRight:10}}>
                        <div >
                            <Image src='/titulo_associacao.png' />
                        </div>
                    </div>
                    <animated.div style={{marginLeft:'10px', color:'#fff', marginTop:5, textAlign:'center', fontSize:mobile?15:20, fontFamily:'Effra'}}>ARRASTE OS ASSUNTOS CORRESPONDENTES:</animated.div>
                    <br/>
                    <animated.div style={traco}/>

                    <animated.div className={size.width>500?'ball':'ball-mobile'} {...bind0()} style={{ x:x0, y:y0, opacity:opacity0, zIndex:zIndex0, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[0].color }} >
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px', color:positions[0].color === '#272727'?positions[0].color:'#099abf'}}>{positions[0].conteudo}</div>
                    </animated.div>
                    <animated.div className={size.width>500?'ball':'ball-mobile'}  style={{ x:x1, y:y1, opacity:opacity1, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[1].color }} >
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px',color:positions[1].color === '#272727'?positions[1].color:'#099abf'}}>{positions[1].conteudo}</div>
                    </animated.div>
                    <animated.div className={size.width>500?'ball':'ball-mobile'} {...bind2()} style={{ x:x2, y:y2, opacity:opacity2, zIndex:zIndex2, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[2].color }} >
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px', color:positions[2].color === '#272727'?positions[2].color:'#099abf'}}>{positions[2].conteudo}</div>
                    </animated.div>
                    <animated.div className={size.width>500?'ball':'ball-mobile'}  style={{ x:x3, y:y3, opacity:opacity3, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[3].color }} >
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px', color:positions[3].color === '#272727'?positions[3].color:'#099abf'}}>{positions[3].conteudo}</div>
                    </animated.div>
                    <animated.div className={size.width>500?'ball':'ball-mobile'} {...bind4()} style={{ x:x4, y:y4, opacity:opacity4, zIndex:zIndex4, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[4].color }} >
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px', color:positions[4].color === '#272727'?positions[4].color:'#099abf'}}>{positions[4].conteudo}</div>
                    </animated.div>
                    <animated.div className={size.width>500?'ball':'ball-mobile'}  style={{ x:x5, y:y5, opacity:opacity5, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[5].color }}>
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px', color:positions[5].color === '#272727'?positions[5].color:'#099abf'}}>{positions[5].conteudo}</div>
                    </animated.div>
                    <animated.div className={size.width>500?'ball':'ball-mobile'} {...bind6()} style={{ x:x6, y:y6, opacity:opacity6, zIndex:zIndex6, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[6].color }} >
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px', color:positions[6].color === '#272727'?positions[6].color:'#099abf'}}>{positions[6].conteudo}</div>
                    </animated.div>
                    <animated.div className={size.width>500?'ball':'ball-mobile'}  style={{ x:x7, y:y7, opacity:opacity7, position:'absolute', borderWidth:2, borderStyle:'solid', borderRadius:20, borderColor:positions[7].color }} >
                        <div style={{alignItems:'center', height:ballSize, display:'flex', marginLeft:'10px', marginRight:'10px', color:positions[7].color === '#272727'?positions[7].color:'#099abf'}}>{positions[7].conteudo}</div>
                    </animated.div>
                  { 
                
            }
            </div>
                
               
            </div>
           
           
        </div>
        </div>
        )
}