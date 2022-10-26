import React, {useEffect, useState} from 'react';
import { Button } from 'semantic-ui-react'

const id = 'SP3OcOK6rf4';

const YouTubeVideo = () =>  {

const [playerVideo, setPlayerVideo] = useState(null)
const [playerReady, setPlayerReady] = useState(null)
const [muted, setMuted] = useState(true)
const [width, setWidth] = useState(null)
const [orientation, setOrientation] = useState(null)

const isMobile = width <= 625;


useEffect(() => {

    window.addEventListener('orientationchange', setScreenOrientation);
    window.addEventListener('resize', handleWindowSizeChange);
    setWidth(window.innerWidth);

    if (!window.YT) { // If not, load the script asynchronously
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
  
        // onYouTubeIframeAPIReady will load the video after the script is loaded
        window.onYouTubeIframeAPIReady = loadVideo;
  
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      } else { // If script is already there, load the video directly
        loadVideo();
      }

      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
        window.removeEventListener('orientationchange', setScreenOrientation);
      }
}, [])

useEffect(() => {
    //console.log(width)
}, [width])

const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  const setScreenOrientation = () => {

    if (window.matchMedia("(orientation: portrait)").matches) {
       // console.log('orientation: portrait');
        setOrientation('landscape');
      }else{
       // console.log('orientation: landscape');
        setOrientation('portrait');
      }

   // setOrientation(window.innerWidth);
  };



const loadVideo = () => {
    const player = new window.YT.Player(`youtube-player-${id}`, {
      videoId: id,
      playerVars: { 'autoplay': 1, 'playsinline': 1 },
      events: {
        onReady: onPlayerReady,
        
      }, 
    });
  };

  const onPlayerReady = event => {
    setPlayerVideo(event.target)
    event.target.mute();
    event.target.playVideo();
  };

  const toggleMute = () => {

      if(muted){
        playerVideo.unMute()
        setMuted(false)
      }else{
        playerVideo.mute()
        setMuted(true)
      }
  }

  const toggleMobile = () => {
      if(width<800){
        return {}
      }else{
        return {flex:1, justifyContent:'center'}
      }
  }

  const toggleWidth = () => {
    if(width<800 && orientation !== 'landscape'){
      return {height:230}
    }else{
      return {width:'100%'}
    }
}

 

    return (
        <div style={{height:'100px'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', margin:0}}>
                <div id={`youtube-player-${id}`} style={toggleWidth()} />

                <div style={{display:'flex', position:'absolute'}} ><Button onClick={() => toggleMute()}>Aperte aqui para habilitar o som</Button></div>
               
            </div>
            <div>orientation: {orientation}</div>
        </div>
    );
  
}

export default YouTubeVideo;