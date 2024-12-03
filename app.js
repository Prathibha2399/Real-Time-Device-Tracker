const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http'); // to establish the connection we need http server

const app = express();

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", {id: socket.id, ...data})  // socket id will be unique
    })
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id)
    })
})

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(5000, () => {
  console.log('Server is running in the port 5000');
});
