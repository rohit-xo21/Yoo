import { useState, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connectSocket = useCallback(() => {
    if (!socket && !isConnecting) {
      setIsConnecting(true)
      
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'
      
      const newSocket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,        forceNew: true
      })

      newSocket.on('connect', () => {
        setSocket(newSocket)
        setIsConnecting(false)
      })

    newSocket.on('connect_error', (error) => {
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
          connectSocket()
        }, delay)
      } else {
        alert('Unable to connect to server after multiple attempts. Please:\n\n1. Check your internet connection\n2. Try refreshing the page\n3. Switch between WiFi and mobile data')
      }
    })

    newSocket.on('reconnect', () => {
      setConnectionError(null)
    })

    newSocket.on('reconnect_error', () => {
      // Silent error handling
    })

    return newSocket
    }
  }, [socket, isConnecting])

  const disconnectSocket = useCallback(() => {
    if (socket) {
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
