import { useState, useEffect, useRef } from 'react'
import { validateMessage } from '../utils/validation'
import { formatTimestamp } from '../utils/helpers'
import { useToast } from '../hooks/useToast'

function Chat({ username, roomId, chatType, socket, onLeaveChat, isRoomCreator, onFindNewStranger }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [partnerUsername, setPartnerUsername] = useState('')
  const messagesEndRef = useRef(null)
  const { showError } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!socket) return

    setIsConnected(true)

    // For room chat, request the current user list when component mounts
    if (chatType === 'room' && roomId) {
      socket.emit('get-room-users', { roomId })
    }

    // Listen for messages
    socket.on('receive-message', (messageData) => {
      setMessages(prev => [...prev, messageData])
    })

    // Listen for room events
    if (chatType === 'room') {
      socket.on('room-users', (userList) => {
        setUsers(userList)
      })

      socket.on('user-joined', (data) => {
        setUsers(data.users)
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          message: `${data.username} joined the room`,
          timestamp: new Date().toISOString()
        }])
      })

      socket.on('user-left', (data) => {
        setUsers(data.users)
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          message: `${data.username} left the room`,
          timestamp: new Date().toISOString()
        }])
      })
    }

    // Listen for stranger events
    if (chatType === 'stranger') {
      socket.on('stranger-matched', (data) => {
        setPartnerUsername(data.partnerUsername)
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          message: `Connected with ${data.partnerUsername}`,
          timestamp: new Date().toISOString()        }])
      })

      socket.on('stranger-left', (data) => {
        // Handle enhanced stranger-left event with redirect instructions
        const reason = data?.reason || 'unknown'
        const message = data?.message || 'Stranger disconnected.'
        const shouldRedirectHome = data?.redirectToHome || false
        
        console.log('Stranger left event received:', { reason, message, shouldRedirectHome })
          setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          message: message,
          timestamp: new Date().toISOString(),
          isRedirect: shouldRedirectHome // Flag for special styling
        }])
        
        // Redirect based on server instruction
        setTimeout(() => {
          if (shouldRedirectHome) {
            // New behavior: Go directly to home when partner leaves
            console.log('Redirecting to home as instructed by server')
            onLeaveChat() // This will disconnect and go to home
          } else {
            // Legacy behavior: Try to find new stranger (for high traffic scenarios)
            if (onFindNewStranger) {
              onFindNewStranger() // Start searching for a new stranger
            } else {
              onLeaveChat() // Fallback to going back to home
            }
          }
        }, 2000) // Wait 2 seconds to show the disconnect message
      })
    }

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socket.off('receive-message')
      socket.off('room-users')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('stranger-matched')
      socket.off('stranger-left')
      socket.off('disconnect')
    }
  }, [socket, chatType, roomId, onLeaveChat, onFindNewStranger])
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!socket) return
    
    const validation = validateMessage(newMessage)
    if (!validation.isValid) {
      showError(validation.message)
      return
    }

    socket.emit('send-message', {
      message: validation.message,
      roomId: roomId,
      chatType: chatType
    })

    setNewMessage('')
  }

  const formatTime = (timestamp) => {
    return formatTimestamp(timestamp)
  }

  const getChatTitle = () => {
    if (chatType === 'room') {
      return `Room: ${roomId}`
    } else if (chatType === 'stranger') {
      return partnerUsername ? `Chat with ${partnerUsername}` : 'Stranger Chat'
    }
    return 'Chat'
  }
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 m-4 mb-0 flex-shrink-0"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem'
        }}
      >        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h1 
              className="text-lg sm:text-xl font-light text-white flex items-center"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse flex-shrink-0"></span>
              <span className="truncate">{getChatTitle()}</span>
            </h1>
            
            {/* Show room code for room chats */}
            {chatType === 'room' && (
              <div className="flex items-center gap-2 ml-6 mt-1 flex-wrap">
                <span 
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Room Code:
                </span>
                <code 
                  className="px-2 py-1 rounded text-white cursor-pointer transition-all duration-200 hover:bg-white hover:bg-opacity-30 text-xs sm:text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    fontFamily: 'monospace'
                  }}
                  onClick={() => navigator.clipboard.writeText(roomId)}
                  title="Click to copy"
                >
                  {roomId}
                </code>
              </div>
            )}
            
            <p 
              className="text-sm ml-6"
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {isConnected ? (
                `Connected as ${username}`
              ) : (
                <span style={{ color: '#ef4444' }}>Disconnected</span>
              )}
            </p>
            
            {chatType === 'stranger' && partnerUsername && (
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium ml-6 mt-1 inline-block"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Chatting with: {partnerUsername}
              </div>
            )}
          </div>
            <button
            onClick={onLeaveChat}
            className="px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 flex items-center hover:bg-white hover:bg-opacity-20 flex-shrink-0"
            style={{
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>      <div className="flex-1 flex p-4 overflow-hidden">
        {/* Messages Area */}
        <div 
          className="flex-1 flex flex-col min-w-0"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${
                message.type === 'system' 
                  ? 'justify-center' 
                  : message.username === username 
                    ? 'justify-end' 
                    : 'justify-start'
              }`}>
                {message.type === 'system' ? (
                  <div 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {message.message}
                  </div>                ) : (                  <div 
                    className="px-3 sm:px-4 py-2"
                    style={{
                      maxWidth: message.username === username ? '85%' : '85%',
                      marginLeft: message.username === username ? 'auto' : '0',
                      marginRight: message.username === username ? '0' : 'auto',
                      background: 'linear-gradient(135deg, #333333, #000000)',
                      color: '#ffffff',
                      borderRadius: message.username === username 
                        ? '1.5rem 1.5rem 0.5rem 1.5rem' 
                        : '1.5rem 1.5rem 1.5rem 0.5rem',
                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 2px 10px rgba(0, 0, 0, 0.2)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >                    <div 
                      className="text-xs mb-1"
                      style={{
                        opacity: '0.75',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      {message.username} • {formatTime(message.timestamp)}
                    </div>
                    <div className="break-words text-sm sm:text-base">{message.message}</div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>          {/* Message Input */}
          <div className="p-3 sm:p-4 flex-shrink-0">
            <form onSubmit={handleSendMessage}>
              <div 
                className="flex items-center gap-2 p-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '2rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 sm:px-4 py-3 bg-transparent border-0 outline-none text-gray-800 text-sm sm:text-base"
                  style={{
                    color: '#2d3748',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  disabled={!isConnected}
                  maxLength={import.meta.env.VITE_MAX_MESSAGE_LENGTH || 500}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  className="w-10 h-10 rounded-full border-0 text-white flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #333333, #000000)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>        {/* Users Sidebar (only for room chat and only for room creator, hidden on mobile) */}
        {chatType === 'room' && isRoomCreator && (
          <div 
            className="hidden md:block w-64 ml-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.5rem'
            }}
          >
            <h2 
              className="text-lg font-light text-white mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Users ({users.length})
            </h2>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-lg transition-all duration-200"
                  style={{
                    background: user.username === username 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>
                      {user.username}
                    </span>
                    {user.username === username && (
                      <span 
                        className="ml-auto text-xs"
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontFamily: 'Inter, sans-serif' 
                        }}
                      >
                        (You)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
