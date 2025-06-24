import { useState, useEffect } from 'react'

const ConnectionStatus = ({ socket, connectionError }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [status, setStatus] = useState('disconnected')

  useEffect(() => {
    if (socket) {
      setStatus(socket.connected ? 'connected' : 'connecting')
      
      const handleConnect = () => {
        setStatus('connected')
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 3000)
      }
      
      const handleDisconnect = () => {
        setStatus('disconnected')
        setIsVisible(true)
      }
      
      const handleReconnect = () => {
        setStatus('connected')
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 3000)
      }

      socket.on('connect', handleConnect)
      socket.on('disconnect', handleDisconnect)
      socket.on('reconnect', handleReconnect)

      return () => {
        socket.off('connect', handleConnect)
        socket.off('disconnect', handleDisconnect)
        socket.off('reconnect', handleReconnect)
      }
    } else if (connectionError) {
      setStatus('error')
      setIsVisible(true)
    }
  }, [socket, connectionError])

  if (!isVisible && status === 'connected') return null

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-green-500',
          icon: '✅',
          message: 'Connected to server'
        }
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          icon: '🔄',
          message: 'Connecting to server...'
        }
      case 'disconnected':
        return {
          color: 'bg-red-500',
          icon: '❌',
          message: 'Disconnected from server'
        }
      case 'error':
        return {
          color: 'bg-red-600',
          icon: '⚠️',
          message: connectionError || 'Connection error'
        }
      default:
        return {
          color: 'bg-gray-500',
          icon: '❓',
          message: 'Unknown status'
        }
    }
  }

  const { color, icon, message } = getStatusConfig()

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-300 ${color}`}>
      <div className="flex items-center space-x-2">
        <span className={status === 'connecting' ? 'animate-spin' : ''}>{icon}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}

export default ConnectionStatus
