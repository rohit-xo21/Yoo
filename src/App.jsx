import NicknameModal from './components/NicknameModal'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Chat from './components/Chat'
import Matching from './components/Matching'
import Silk from './components/Silk'
import Footer from './components/layout/Footer'
import MultipleTabsModal from './components/layout/MultipleTabsModal'
import ConnectionStatus from './components/ConnectionStatus'
import { ToastProvider, useToast } from './hooks/useToast.jsx'
import { useSocket } from './hooks/useSocket'
import { useTabManager } from './hooks/useTabManager'
import { useAppState } from './hooks/useAppState'
import { createChatHandlers } from './handlers/chatHandlers'
import './App.css'

function AppContent() {
  const { isActiveTab } = useTabManager()
  const appState = useAppState()
  const { socket, isConnecting, connectionError, connectSocket, disconnectSocket } = useSocket()
  const { showError, showWarning, showInfo } = useToast()
  
  const {
    currentView,
    setCurrentView,
    username,
    setUsername,
    roomId,
    chatType,
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
  } = createChatHandlers(appState, socket, connectSocket, disconnectSocket, isConnecting, (message, type) => {
    // Map toast types
    if (type === 'error') showError(message)
    else if (type === 'warning') showWarning(message)
    else showInfo(message)
  })

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
      {/* Connection Status Indicator */}
      <ConnectionStatus socket={socket} connectionError={connectionError} />
      
      {/* Global Silk Background */}
      <Silk />
      
      {/* Nickname Modal */}
      {showNicknameModal && (
        <NicknameModal 
          isOpen={showNicknameModal}
          onSubmit={handleNicknameSubmit}
        />
      )}

      {/* Main Content */}
      {!showNicknameModal && (
        <>
          {/* Navbar - Hidden in chat views */}
          {currentView !== 'chat' && (            <Navbar 
              username={username}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onLogout={handleLogout}
            />
          )}
          
          {/* Home Page */}
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

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
