const { Socket } = require('dgram');
const { render } = require('ejs');
const express = require('express');
const app = express();
const { v4 : uuvidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const { get } = require('http');
const server  = require('http').Server(app);
const io = require('socket.io')(server);
const peerServer = ExpressPeerServer(server , {debug : true});


app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs',peerServer);




app.get('/', (req,res)=>{
          res.status= 200;
          res.render('index');
})

app.get('/room',(req,res)=>{
      var ROOMID = req.query.ROOMID;
      var USERID = req.query.USERID;
      res.status= 200;
      res.render('room',{ ROOMID : ROOMID , USERID : USERID});
})

io.on('connection', socket=>{
    socket.on('Join-room', (ROOMID, USERID) => {  
         socket.join(ROOMID);
         socket.to(ROOMID).broadcast.emit("user-connected", USERID);
    });
})



server.listen(process.env.PORT || 3030);