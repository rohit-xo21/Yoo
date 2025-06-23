import { useState, useEffect, useRef } from 'react'

function Navbar({ username, onCreateRoom, onJoinRoom, onLogout }) {
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [roomId, setRoomId] = useState('')
  const mobileMenuRef = useRef(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false)
      }
    }

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMobileMenu])

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    onCreateRoom(newRoomId)
    setShowRoomModal(false)
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (roomId.trim()) {
      onJoinRoom(roomId.trim())
      setShowRoomModal(false)
      setRoomId('')
    }
  }
  return (
    <>
      {/* Global Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes buttonPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        @keyframes pageTransition {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .page-transition {
          animation: pageTransition 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .button-hover-glow:hover {
          animation: buttonPulse 1.5s infinite;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .modal-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .modal-button:active {
          transform: translateY(0);
          transition: all 0.1s ease;
        }
      `}</style>

      {/* Navbar */}<nav 
        className="fixed top-0 w-full z-50"
        style={{
          background: 'transparent',
          backdropFilter: 'none'
        }}
      >        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left side on desktop, hidden on mobile */}
            <div 
              className="flex items-center gap-2 sm:flex hidden"
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              Yoo
            </div>            {/* Mobile hamburger menu */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
              title="Menu"
              style={{ outline: 'none' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Centered username - always visible */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                fontSize: '0.95rem',
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              Hey, <span className="text-white font-medium">{username}</span>!
            </div>

            {/* Desktop actions - Right side */}
            <div className="hidden sm:flex items-center gap-4">              <button
                onClick={() => setShowRoomModal(true)}
                className="transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '400',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ffffff'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.9)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
              >
                Rooms
              </button>
                <button
                onClick={onLogout}
                className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
                title="Logout"
                style={{ outline: 'none' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>          {/* Mobile dropdown menu */}
          {showMobileMenu && (
            <div 
              ref={mobileMenuRef}
              className="sm:hidden absolute top-16 left-4 right-4 z-40"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem',
                animation: 'slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformOrigin: 'top center'
              }}
            >
              <div className="space-y-3">                <button
                  onClick={() => {
                    setShowRoomModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="w-full text-center py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:bg-opacity-20"
                  style={{
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '1rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    outline: 'none'
                  }}
                >
                  Rooms
                </button>
                  <button
                  onClick={onLogout}
                  className="w-full text-center py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                  style={{
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '1rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    outline: 'none'
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>      {/* Room Modal */}
      {showRoomModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="absolute inset-0"
            onClick={() => setShowRoomModal(false)}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              animation: 'fadeIn 0.3s ease-out'
            }}
          />
          
          <div 
            className="relative w-full max-w-md"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              padding: '3rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: 'translateY(0)',
              opacity: '1'
            }}
          >
            <div className="text-center mb-6">
              <h3 
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  fontWeight: '300',
                  lineHeight: '1.2',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: '#ffffff',
                  marginBottom: '0.5rem'
                }}
              >
                Join or Create Room
              </h3>              <p 
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              >
                Connect with friends in a private room
              </p>
            </div>

            <div className="space-y-4">              {/* Create Room */}              <button
                onClick={handleCreateRoom}
                className="w-full transition-all duration-300 hover:bg-white hover:bg-opacity-20"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.75rem',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                Create New Room
              </button>              <div className="relative flex items-center my-6">
                <div className="flex-1 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}></div>
                <span 
                  className="px-4 mx-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  or
                </span>
                <div className="flex-1 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}></div>
              </div>

              {/* Join Room */}
              <form onSubmit={handleJoinRoom} className="space-y-3">                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}                  placeholder="Enter Room ID"
                  className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all duration-200 text-white placeholder-white placeholder-opacity-60"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  maxLength={6}
                />                <button
                  type="submit"
                  disabled={!roomId.trim()}                  className="w-full transition-all duration-300 hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"                  style={{
                    background: 'transparent',
                    color: 'rgb(255, 255, 255)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Join Room
                </button>
              </form>
            </div>            {/* Close Button */}
            <button
              onClick={() => setShowRoomModal(false)}
              className="absolute top-4 right-4 text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
              style={{ outline: 'none' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
