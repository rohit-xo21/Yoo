import { useState, useCallback } from 'react'
import { io } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  
  const connectSocket = useCallback(() => {
    if (!socket && !isConnecting) {
      setIsConnecting(true)
      
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'
      console.log('Connecting to server at:', serverUrl)
      
      const newSocket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,        forceNew: true
      })

      newSocket.on('connect', () => {
        console.log('✅ Connected to server with socket ID:', newSocket.id)
        setSocket(newSocket)
        setIsConnecting(false)
        
        // Add global event listener for debugging
        newSocket.onAny((eventName, ...args) => {
          console.log(`🔊 Socket received event: ${eventName}`, args)
        })
      })

      newSocket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error)
        setIsConnecting(false)
        alert('Failed to connect to server. Please try again.')
      })

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from server')
        setSocket(null)
      })

      return newSocket
    }
    return socket
  }, [socket, isConnecting])

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
    setIsConnecting(false)
  }, [socket])

  return {
    socket,
    isConnecting,
    connectSocket,
    disconnectSocket
  }
}
