
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myVideoStream
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo, stream);

    peer.on('call',call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video,userVideoStream)
        })
    })

    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream);
    })
    let msg = $('input')

$('html').keydown((e)=>{
    if(e.which == 13 && msg.val().length !==0 ){
        console.log(msg.val());
        socket.emit('message', msg.val());
        msg.val('')
    }
});

socket.on('createMessage', message => {
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
})
})

socket.on('user-disconnected',userId => {
    if(peers[userId]) peers[userId].close()
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID,id);
})


const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })

    peers[userId] =call 
}


const addVideoStream = (video,stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop('scrollHeight'))
}

//Mute Video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }

}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    console.log('object');
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        setPlayVideo()
        myVideoStream.getVideoTracks()[0].enabled = false;
    }else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () => {
    const html = `
        <i class="play_video fas fa-video-slash"></i>
        `
        document.querySelector('.main__video_button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
        <i class="stop_video fas fa-video"></i>
        `
        document.querySelector('.main__video_button').innerHTML = html;
}

