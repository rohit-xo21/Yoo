import NicknameModal from './components/NicknameModal'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Chat from './components/Chat'
import Matching from './components/Matching'
import Silk from './components/Silk'
import Footer from './components/layout/Footer'
import MultipleTabsModal from './components/layout/MultipleTabsModal'
import { useSocket } from './hooks/useSocket'
import { useTabManager } from './hooks/useTabManager'
import { useAppState } from './hooks/useAppState'
import { createChatHandlers } from './handlers/chatHandlers'
import './App.css'

function App() {
  const { isActiveTab } = useTabManager()
  const appState = useAppState()
  const { socket, isConnecting, connectSocket, disconnectSocket } = useSocket()
    const {
    currentView,
    setCurrentView,
    username,
    setUsername,
    roomId,    chatType,
    showNicknameModal,
    setShowNicknameModal,
    isRoomCreator
  } = appState

  const {
    handleChatWithStranger,
    handleCreateRoom,
    handleJoinRoom,
    handleLeaveChat,
    handleFindNewStranger
  } = createChatHandlers(appState, socket, connectSocket, disconnectSocket, isConnecting)

  const handleNicknameSubmit = (newUsername) => {
    setUsername(newUsername)
    setCurrentView('home')
    setShowNicknameModal(false)
  }

  const handleCancelMatching = () => {
    disconnectSocket()
    appState.resetToHome()
  }

  const handleLogout = () => {
    disconnectSocket()
    sessionStorage.removeItem('chatapp_username')
    localStorage.removeItem('chatapp_active_tab')
    setUsername('')
    setCurrentView('nickname')
    setShowNicknameModal(true)
    appState.resetToHome()
  }

  // Show multiple tabs modal if not active tab
  if (!isActiveTab) {
    return (
      <div className="min-h-screen relative" style={{ background: 'transparent' }}>
        <Silk />
        <MultipleTabsModal />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'transparent' }}>
      {/* Global Silk Background */}
      <Silk />      {/* Nickname Modal */}
      {showNicknameModal && (
        <NicknameModal 
          isOpen={showNicknameModal}
          onSubmit={handleNicknameSubmit}
        />
      )}

      {/* Main Content */}
      {!showNicknameModal && (
        <>          {/* Navbar - Hidden in chat views */}
          {currentView !== 'chat' && (
            <Navbar 
              username={username}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onLogout={handleLogout}
            />
          )}          {/* Home Page */}
          {currentView === 'home' && (
            <Home 
              username={username}
              onChatWithStranger={handleChatWithStranger}
            />
          )}

          {/* Matching Screen */}
          {currentView === 'matching' && (
            <Matching 
              onCancel={handleCancelMatching}
            />
          )}

          {/* Chat Screen */}
          {currentView === 'chat' && socket && (
            <Chat 
              username={username}
              roomId={roomId}
              chatType={chatType}
              socket={socket}
              onLeaveChat={handleLeaveChat}
              isRoomCreator={isRoomCreator}
              onFindNewStranger={handleFindNewStranger}
            />
          )}
        </>
      )}

      {/* Footer - only show on home page */}
      {isActiveTab && currentView === 'home' && <Footer />}
    </div>
  )
}

export default App
