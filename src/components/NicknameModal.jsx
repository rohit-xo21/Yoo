import { useState, useEffect, useRef } from 'react'

function NicknameModal({ isOpen, onSubmit }) {
  const [nickname, setNickname] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus the input when modal opens
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nickname.trim()) {
      onSubmit(nickname.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      // Don't allow closing this modal with Escape as it's required
      e.preventDefault()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nickname-modal-title"
      aria-describedby="nickname-modal-description"
      onKeyDown={handleKeyDown}
    >
      {/* Modal Content */}
      <div 
        className="relative z-10 w-full max-w-md mx-4 shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '2rem',
          padding: '3rem'
        }}
      >
        <div className="text-center mb-8">
          <h2 
            id="nickname-modal-title"
            className="text-3xl font-light text-white mb-2" 
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Welcome to Yoo
          </h2>
          <p 
            id="nickname-modal-description"
            className="text-sm" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.85)',
              fontFamily: 'Inter, sans-serif' 
            }}
          >
            Enter your nickname to start connecting
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname-input" className="sr-only">
              Nickname
            </label>            <input
              id="nickname-input"
              ref={inputRef}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              required
              minLength={2}
              maxLength={20}
              aria-describedby="nickname-requirements"
              className="w-full px-6 py-4 rounded-xl text-white transition-all duration-200 placeholder-white placeholder-opacity-60"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                fontFamily: 'Inter, sans-serif'
              }}            />
            <div 
              id="nickname-requirements"
              className="mt-2 text-xs"
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              2-20 characters, letters and numbers only
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.2))'
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))'
              }
            }}
          >
            Continue to Chat
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p 
            className="text-xs" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'Inter, sans-serif' 
            }}
          >
            Your nickname will be stored locally for this session
          </p>
        </div>
      </div>
    </div>
  )
}

export default NicknameModal
