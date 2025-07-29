const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const config = require('./config');
const SocketController = require('./controllers/SocketController');

const app = express();
const server = http.createServer(app);

// Enhanced Socket.IO configuration for mobile compatibility
const io = socketIo(server, {
  cors: config.cors,
  path: config.socketPath,
  transports: ['websocket', 'polling'], // Enable both transports
  allowEIO3: true, // Support for older clients
  pingTimeout: 60000, // Increase timeout for mobile networks
  pingInterval: 25000, // Adjust ping interval
  upgradeTimeout: 30000, // Increase upgrade timeout
  maxHttpBufferSize: 1e6, // 1MB buffer size
  allowRequest: (req, callback) => {
    // Additional validation for mobile browsers
    const origin = req.headers.origin;
    const userAgent = req.headers['user-agent'] || '';
    
    // Log connection attempts for debugging
    console.log('Connection attempt from:', {
      origin,
      userAgent: userAgent.substring(0, 100),
      ip: req.socket.remoteAddress
    });
    
    callback(null, true); // Allow all connections for now
  }
});

// Add middleware for better mobile support
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add headers for mobile compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.cors.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint for debugging
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    cors: config.cors
  });
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

server.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📱 Mobile compatibility: Enhanced`);
  console.log(`🌐 Environment: ${config.nodeEnv}`);
  console.log(`🔒 CORS origin: ${JSON.stringify(config.cors.origin)}`);
});
