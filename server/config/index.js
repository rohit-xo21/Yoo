require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.FRONTEND_URL || '*', // Allow all origins for now to debug connection issues
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["*"],
    optionsSuccessStatus: 200 // For legacy browser support
  },
  staticPath: process.env.STATIC_PATH || '../dist',
  socketPath: process.env.SOCKET_PATH || '/socket.io'
};

module.exports = config;
