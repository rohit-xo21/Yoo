import { useState } from 'react'
import { io } from 'socket.io-client'

function RoomSelector({ username, onJoinRoom, onBackToStart }) {
  const [roomId, setRoomId] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [waitingForStranger, setWaitingForStranger] = useState(false)

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (roomId.trim()) {
      setIsConnecting(true)
      const socket = io(import.meta.env.VITE_SOCKET_URL || '')
      
      socket.emit('join-room', { roomId: roomId.trim(), username })
      
      socket.on('room-users', () => {
        setIsConnecting(false)
        onJoinRoom(roomId.trim(), 'room', socket)
      })

      socket.on('connect_error', () => {
        setIsConnecting(false)
        alert('Failed to connect to server')
      })
    }
  }

  const handleFindStranger = () => {
    setWaitingForStranger(true)
    const socket = io(import.meta.env.VITE_SOCKET_URL || '')
    
    socket.emit('find-stranger', { username })
    
    socket.on('stranger-matched', (data) => {
      setWaitingForStranger(false)
      onJoinRoom(data.chatId, 'stranger', socket)
    })

    socket.on('waiting-for-stranger', () => {
      // Keep waiting state
    })

    socket.on('connect_error', () => {
      setWaitingForStranger(false)
      alert('Failed to connect to server')
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, <span className="text-blue-400">{username}</span>!
          </h1>
          <p className="text-gray-400">Choose how you want to chat</p>
        </div>

        <div className="space-y-6">
          {/* Join Room Section */}
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
              Join a Room
            </h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isConnecting}
              />
              <button
                type="submit"
                disabled={!roomId.trim() || isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {isConnecting ? 'Joining...' : 'Join Room'}
              </button>
            </form>
          </div>

          {/* Stranger Chat Section */}
          <div className="bg-gray-700 p-6 rounded-xl border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
              Chat with Stranger
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Get matched with a random person for one-on-one chat
            </p>
            <button
              onClick={handleFindStranger}
              disabled={waitingForStranger}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {waitingForStranger ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Finding stranger...
                </div>
              ) : (
                'Chat with Stranger'
              )}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onBackToStart}
            className="text-gray-400 hover:text-white transition-colors duration-200 underline"
          >
            ← Back to start
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomSelector
