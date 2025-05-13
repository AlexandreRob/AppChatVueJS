const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const users = new Set();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

io.on("connection", (socket) => {
  //   console.log(`user is connected`);

  socket.on("join", (username) => {
    socket.username = username;
    users.add(username);
    io.emit("user:joined", `${username} a rejoint le chat`);
    io.emit("users:update", Array.from(users));
  });

  socket.on("message", (data) => {
    // socket.emit("message:sent", data);
    socket.broadcast.emit("message:received", data);
    // io.emit("message:received", data); // au lieu de socket.broadcast.emit
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      console.log(`user left`);
      users.delete(socket.username);
      io.emit("users:update", Array.from(users));
    }
  });
});

httpServer.listen(3000, () => {
  console.log("server on: http://localhost:3000/");
});
