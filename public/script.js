const videoGrid = document.getElementById('video-grid');
var myMedia;
var newVideo = document.createElement('video');
newVideo.muted= true;
newVideo.classList.add('myVideo');

var ISmute = false;
var ISvideo = false;
const mute =()=>{
    
    if(!ISmute){
        document.getElementById('unmute').style.display='block';
        document.getElementById('mute').style.display='none';
    }
    else{
        document.getElementById('mute').style.display="block";
        document.getElementById('unmute').style.display='none';
   }
    myMedia.getAudioTracks()[0].enabled = ISmute;  
    ISmute=!ISmute;
}

const video = () =>{
    if(!ISvideo){
        document.getElementById('videocamoff').style.display="block";
        document.getElementById('videocamon').style.display="none";
    }
    else{
        document.getElementById('videocamoff').style.display="none";
        document.getElementById('videocamon').style.display="block";
   }
    myMedia.getVideoTracks()[0].enabled=ISvideo;
    ISvideo=!ISvideo;
}

const leave = () =>{
      socket.emit('end');
}

// function to add video element to grid
const addvideoElement =(element,srcObject) =>{
    if(!element){
        element = document.createElement('video');
        element.classList.add('col');
    }
        element.srcObject = srcObject;
        element.addEventListener('loadedmetadata', ()=>{
            element.play();
        });
        videoGrid.append(element);
}
//code to get audio and video from device
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(
    mediaData =>{
       myMedia = mediaData;
       addvideoElement(newVideo,myMedia);
    }
)


console.log(ROOMID);
console.log(USERID);
const callList = [];
const socket = io('/');
const peer = new Peer(USERID);

//send info to server 
socket.emit('Join-room',ROOMID,USERID);

peer.on('call', call =>{
    call.answer(myMedia);
    var accept = true;
    call.on('stream', data=> {
            console.log("acceptcall");
            if(accept){   
            addvideoElement(false,data);
            accept=false;
            }
    });
});



socket.on('user-connected', ID => {

    
    var call = peer.call(ID,myMedia);
   
        call.on('stream', data => { 
            if(!callList.includes(ID)){
                console.log("user-connected");
                addvideoElement(false,data);
                callList.push(ID);
            }
            
        });
    
    
});



/* call.on('stream', data => {
        if(!callList.includes(ID)){
          addvideoElement(false,data);
          callList.push(ID);
         console.log(callList);
}
    });

    */