import { generateRoomId } from '../utils/helpers'

export const createChatHandlers = (
  appState,
  socket,
  connectSocket,
  disconnectSocket,
  isConnecting
) => {
  const {
    setCurrentView,
    setRoomId,
    setChatType,
    setIsRoomCreator,    resetToHome,
    username,
    roomId,
    chatType
  } = appState

  const handleChatWithStranger = () => {
    if (isConnecting) {
      alert('Already connecting, please wait...')
      return
    }

    const newSocket = connectSocket()
    if (newSocket) {
      setChatType('stranger')
      setCurrentView('matching')
      setIsRoomCreator(false)
      
      // Set up event listeners for stranger matching
      newSocket.emit('find-stranger', { username })
      
      newSocket.on('stranger-matched', (data) => {
        setRoomId(data.chatId || data.roomId)
        setCurrentView('chat')
      })
      
      newSocket.on('waiting-for-stranger', () => {
        // Keep showing matching screen
      })
    }
  }
  const handleCreateRoom = (newRoomId) => {
    if (isConnecting) {
      alert('Already connecting, please wait...')
      return
    }

    // Use provided roomId or generate a new one
    const roomIdToUse = newRoomId || generateRoomId()
    const newSocket = connectSocket()
    
    if (newSocket) {
      setChatType('room')
      setRoomId(roomIdToUse)
      setIsRoomCreator(true)
      setCurrentView('chat')
      
      newSocket.emit('join-room', { username, roomId: roomIdToUse })
    }
  }

  const handleJoinRoom = (roomIdToJoin) => {
    if (isConnecting) {
      alert('Already connecting, please wait...')
      return
    }

    const newSocket = connectSocket()
    
    if (newSocket) {
      setChatType('room')
      setRoomId(roomIdToJoin)
      setIsRoomCreator(false)
      setCurrentView('chat')
      
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
