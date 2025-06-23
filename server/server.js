const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const config = require('./config');
const SocketController = require('./controllers/SocketController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: config.cors
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, config.staticPath)));

// Initialize socket controller
const socketController = new SocketController(io);

// Handle socket connections
io.on('connection', (socket) => {
  socketController.handleConnection(socket);
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, config.staticPath, 'index.html'));
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
