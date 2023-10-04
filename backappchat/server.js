const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server (httpServer, {
    cors: {
      origin: "*",
      methods: ['GET', "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`user ${socket.id} is co`)

    

    socket.on('message', data => {
        socket.broadcast.emit('message:received', data)
    })



    socket.on('disconnect', () => {
        console.log(`user ${socket.id} left`)
    })
})

httpServer.listen(3000, () => {
    console.log('server on: http://localhost:3000/')
}
)