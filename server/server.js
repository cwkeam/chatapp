const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

//custom modules
const {generateMessage} = require('./utils/message');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 8000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

//register an event listner!!
io.on('connection', (socket) => { //client connected to the server.
  console.log("user connected");
  socket.on('disconnect', (socket) => {
    console.log("client disconnected");
  });

  //socket.emit message from admin to someone who joined
  //welcome to chat.app.
  //socket.broadcast.emit to everyone else, new user joined.
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));


  // socket.emit('newMessage', {
  //   from: "John",
  //   text: "see you then",
  //   createdAt: 123123
  // })

  // socket.on('createMessage', (message, cb) => {
  //   console.log('createMessage', message);
  //   //im listening for the server to emit a message.
  //
  //   //then im emitting the message recieved to everyone.
  //
  //   //io emits to everyone - broadcasting.
  //   io.emit('newMessage', generateMessage(message.from, message.text));
  //   cb();
  //   // socket.broadcast.emit('newMessage', {
  //   //   from: message.from,
  //   //   text: message.text,
  //   //   createdAt: new Date().getTime()
  //   //
  //   // });
  //
  // });
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server.');
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });


});


server.listen(port, ()=>{
  console.log('Server is up on',port);
});
