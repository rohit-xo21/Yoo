require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://yoo-production.up.railway.app',
          process.env.FRONTEND_URL,
          /^https:\/\/.*\.vercel\.app$/,  // Allow all Vercel preview deployments
          /^https:\/\/.*\.netlify\.app$/  // Allow Netlify deployments
        ].filter(Boolean)
      : "*",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200 // For legacy browser support
  },
  staticPath: process.env.STATIC_PATH || '../dist',
  socketPath: process.env.SOCKET_PATH || '/socket.io'
};

module.exports = config;
