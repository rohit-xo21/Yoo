require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ["GET", "POST"]
  },
  staticPath: process.env.STATIC_PATH || '../dist',
  socketPath: process.env.SOCKET_PATH || '/socket.io'
};

module.exports = config;
