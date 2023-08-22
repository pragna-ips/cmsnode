
const https = require("https");
var express = require('express');
var fs = require('fs');
const cors = require("cors");
const port = 3006;

const app = express();

// let server;
const privateKey  = fs.readFileSync('certy/privkey.pem', 'utf-8');
const certificate = fs.readFileSync('certy/cert.pem', 'utf-8');
const caBundle = fs.readFileSync('certy/fullchain.pem','utf-8');
const credentials = {key: privateKey, cert: certificate, ca:caBundle};
const parameters = {
  key: privateKey,
  cert: certificate
}

app.get('/',(req,res)=>{
  res.send('HTTPS in ExpressJS')
})

let server = https.createServer(parameters,app)

// var server = require('http').Server(app);

var io = require('socket.io')(server, {
    cors: {
        origin: "https://compliance-management.project-demo.info",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('usertyping', data => {
        io.emit('usertyping', data);
    });

    socket.on('livechat', (data) => {
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(port, () => {
    console.log('Socket.IO server listening on port '+port);
});
