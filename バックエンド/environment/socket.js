var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('connected');
    socket.on('message', function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
