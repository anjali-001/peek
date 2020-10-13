const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4:uuidv4} = require('uuid');
const io = require('socket.io')(server)
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug:true
});

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use('/end',(req,res)=>{
    res.render('leave')
})
app.use('/peerjs',peerServer)
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req,res)=>{
    res.render('room', {roomId:req.params.room}) 
})

io.on('connection', socket=>{
    io.clients((error,clients)=>{     // Added
        if(error) throw error;    // Added
        console.log(clients);    // Added
    })
    // console.log('users connected>>>>', io.clients)
    socket.on('join-room', (roomId,userId)=>{
        // console.log('userId>>>>', userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('message', message => { 
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
            // console.log('userid', userId) //Added

        })
        
    })
})

server.listen(process.env.PORT||8000);