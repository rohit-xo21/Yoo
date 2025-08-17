const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// For Vercel serverless functions
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple API responses
  if (req.url === '/api/test' || req.url === '/test') {
    res.status(200).json({
      message: 'Server is working!',
      status: 'success',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.url === '/api/health' || req.url === '/health' || req.url === '/') {
    res.status(200).json({
      message: 'Yoo Chat Server API',
      status: 'running',
      endpoints: ['/health', '/test', '/socket.io'],
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Default response
  res.status(404).json({
    error: 'Not found',
    availableEndpoints: ['/health', '/test']
  });
};
