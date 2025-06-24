import { useState, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const getSocketURL = () => {
    // Always use the environment variable if available
    const envURL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_SOCKET_URL
    
    if (envURL) {
      // Remove trailing slash if present
      return envURL.replace(/\/$/, '')
    }
    
    // Fallback logic
    if (import.meta.env.PROD) {
      return 'https://yoo-production.up.railway.app'
    }
    
    // For development
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
    return `${protocol}//localhost:3000`
  }

  const connectSocket = useCallback(() => {
    if (socket?.connected) {
      console.log('Socket already connected')
      return socket
    }

    if (isConnecting) {
      console.log('Connection already in progress')
      return null
    }

    setIsConnecting(true)
    setConnectionError(null)
    
    const socketURL = getSocketURL()
    console.log('Attempting to connect to:', socketURL)

    const newSocket = io(socketURL, {
      transports: ['polling', 'websocket'], // Try polling first for mobile compatibility
      timeout: 30000, // 30 second timeout
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      maxReconnectionAttempts: maxReconnectAttempts,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: false, // Don't remember upgrade on mobile
      autoConnect: true,
      // Add query parameters for debugging
      query: {
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 50)
      }
    })

    // Enhanced error handling for mobile
    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully:', newSocket.id)
      setSocket(newSocket)
      setIsConnecting(false)
      setConnectionError(null)
      reconnectAttempts.current = 0
      
      // Add global event listener for debugging
      newSocket.onAny((eventName, ...args) => {
        console.log(`🔊 Socket received event: ${eventName}`, args)
      })
    })

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      setSocket(null)
      setIsConnecting(false)
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        setTimeout(() => {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++
            console.log(`🔄 Reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`)
            connectSocket()
          }
        }, 2000)
      }
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error)
      setIsConnecting(false)
      
      let errorMessage = 'Unable to connect to server'
      
      if (error.message.includes('xhr poll error')) {
        errorMessage = 'Network connection issue. Please check your internet connection.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Connection timeout. Please try again.'
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Connection blocked. Please try refreshing the page.'
      }
      
      setConnectionError(errorMessage)
      
      // Only show alert after multiple failed attempts
      if (reconnectAttempts.current >= 3) {
        alert(`Connection Error: ${errorMessage}\n\nTip: Try switching between WiFi and mobile data, or refresh the page.`)
      }
      
      // Retry connection with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)
        setTimeout(() => {
          reconnectAttempts.current++
          console.log(`🔄 Retry ${reconnectAttempts.current}/${maxReconnectAttempts} after ${delay}ms`)
          connectSocket()
        }, delay)
      } else {
        alert('Unable to connect to server after multiple attempts. Please:\n\n1. Check your internet connection\n2. Try refreshing the page\n3. Switch between WiFi and mobile data')
      }
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('✅ Socket reconnected after', attemptNumber, 'attempts')
      setConnectionError(null)
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection failed:', error)
    })

    return newSocket
  }, [socket, isConnecting])

  const disconnectSocket = useCallback(() => {
    if (socket) {
      console.log('🔌 Disconnecting socket:', socket.id)
      socket.disconnect()
      setSocket(null)
    }
    setIsConnecting(false)
    setConnectionError(null)
    reconnectAttempts.current = 0
  }, [socket])

  return {
    socket,
    isConnecting,
    connectionError,
    connectSocket,
    disconnectSocket
  }
}
