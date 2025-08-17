import { generateRoomId } from '../utils/helpers'
import { validateRoomAccess, validateStrangerChat } from '../utils/validation'

export const createChatHandlers = (
  appState,
  socket,
  connectSocket,
  disconnectSocket,
  isConnecting,
  showToast = null // Optional toast function
) => {  const {
    setCurrentView,
    setRoomId,
    setChatType,
    setIsRoomCreator,
    resetToHome,
    username,
    roomId,
    chatType
  } = appState

  const showMessage = (message, type = 'error') => {
    if (showToast) {
      showToast(message, type)
    } else {
      alert(message) // Fallback to alert if toast not available
    }
  }

  const handleChatWithStranger = () => {
    if (isConnecting) {
      showMessage('Already connecting, please wait...', 'warning')
      return
    }

    // Validate username for stranger chat
    const validation = validateStrangerChat(username)
    if (!validation.isValid) {
      showMessage(validation.message, 'error')
      return
    }
    
    const newSocket = connectSocket()
    if (newSocket) {
      setChatType('stranger')
      setCurrentView('matching')
      setIsRoomCreator(false)
      
      // Remove any existing listeners to prevent duplicates
      newSocket.off('stranger-matched')
      newSocket.off('waiting-for-stranger')
      newSocket.off('waiting-update')
      // Handle successful matching
      newSocket.on('stranger-matched', (data) => {
        // Add delay to prevent race condition with socket disconnection
        setTimeout(() => {
          if (newSocket.connected) {
            setRoomId(data.chatId || data.roomId)
            setCurrentView('chat')
          }
        }, 500)
      })
      
      // Handle waiting for stranger with real-time updates
      newSocket.on('waiting-for-stranger', () => {
        // Keep showing matching screen with updated info
      })
      
      // Handle real-time waiting updates
      newSocket.on('waiting-update', () => {
        // You can add UI updates here to show waiting count
      })
      // Handle when stranger leaves during matching/waiting
      newSocket.on('stranger-left', (data) => {
        const message = data?.message || 'Your partner has left.'
        const shouldRedirectHome = data?.redirectToHome || false
        
        if (shouldRedirectHome) {
          showMessage(message, 'warning')
          disconnectSocket()
          resetToHome()
        }
      })
      
      // Now emit find-stranger after listeners are set up
      newSocket.emit('find-stranger', { username })
    }
  }
  const handleCreateRoom = (newRoomId) => {
    if (isConnecting) {
      showMessage('Already connecting, please wait...', 'warning')
      return
    }

    // Use provided roomId or generate a new one
    const roomIdToUse = newRoomId || generateRoomId()
      // Validate room access
    const validation = validateRoomAccess(username, roomIdToUse)
    if (!validation.isValid) {
      showMessage(validation.message, 'error')
      return
    }
    
    const newSocket = connectSocket()
    
    if (newSocket) {
      setChatType('room')
      setRoomId(roomIdToUse)
      setIsRoomCreator(true)
      setCurrentView('chat')
        // Set up event listeners for room errors
      newSocket.on('room-error', (error) => {
        showMessage(error.message || 'Unable to create room. Please try again.', 'error')
        disconnectSocket()
        resetToHome()
      })
      
      newSocket.emit('join-room', { username, roomId: roomIdToUse })
    }
  }
  const handleJoinRoom = (roomIdToJoin) => {
    if (isConnecting) {
      showMessage('Already connecting, please wait...', 'warning')
      return
    }    // Validate room access
    const validation = validateRoomAccess(username, roomIdToJoin)
    if (!validation.isValid) {
      showMessage(validation.message, 'error')
      return
    }

    const newSocket = connectSocket()
    
    if (newSocket) {
      setChatType('room')
      setRoomId(roomIdToJoin)
      setIsRoomCreator(false)
      setCurrentView('chat')
        // Set up event listeners for room errors
      newSocket.on('room-error', (error) => {
        showMessage(error.message || 'Unable to join room. Please try again.', 'error')
        disconnectSocket()
        resetToHome()
      })
      
      newSocket.emit('join-room', { username, roomId: roomIdToJoin })
    }
  }

  const handleLeaveChat = () => {
    if (socket) {
      if (chatType === 'room') {
        socket.emit('leave-room', { roomId })
      } else if (chatType === 'stranger') {
        socket.emit('leave-stranger-chat')
      }
    }
      disconnectSocket()
    resetToHome()
  }
  
  const handleFindNewStranger = () => {
    if (socket) {
      socket.emit('leave-stranger-chat')
    }
      setChatType('stranger')
    setCurrentView('matching')
    setIsRoomCreator(false)
    
    if (socket) {
      // Remove any existing listeners to prevent duplicates
      socket.off('stranger-matched')
      socket.off('waiting-for-stranger')
      socket.off('waiting-update')
      
      // Set up event listeners BEFORE emitting find-stranger
      socket.on('stranger-matched', (data) => {
        setRoomId(data.chatId || data.roomId)
        setCurrentView('chat')
      })
      
      socket.on('waiting-for-stranger', () => {
        // Waiting for new stranger
      })
      
      socket.on('waiting-update', () => {
        // Waiting update
      })
      
      // Handle when stranger leaves during new stranger search
      socket.on('stranger-left', (data) => {
        const message = data?.message || 'Your partner has left.'
        const shouldRedirectHome = data?.redirectToHome || false
          if (shouldRedirectHome) {
          showMessage(message, 'warning')
          disconnectSocket()
          resetToHome()
        }
      })
      
      // Now emit find-stranger after listeners are set up
      socket.emit('find-stranger', { username })
    }
  }

  return {
    handleChatWithStranger,
    handleCreateRoom,
    handleJoinRoom,
    handleLeaveChat,
    handleFindNewStranger
  }
}
