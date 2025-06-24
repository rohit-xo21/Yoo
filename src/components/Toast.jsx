import { useState, useEffect } from 'react'

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastStyles = () => {
    const baseStyles = {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '0.75rem'
    }

    const typeStyles = {
      info: { borderLeftColor: '#3B82F6' },
      success: { borderLeftColor: '#10B981' },
      warning: { borderLeftColor: '#F59E0B' },
      error: { borderLeftColor: '#EF4444' }
    }

    return { ...baseStyles, ...typeStyles[type] }
  }

  const getIconStyles = () => {
    const colors = {
      info: '#3B82F6',
      success: '#10B981', 
      warning: '#F59E0B',
      error: '#EF4444'
    }
    return { color: colors[type] }
  }

  const getIcon = () => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }
    return icons[type]
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 min-w-[300px] max-w-md transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={getToastStyles()}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0" style={getIconStyles()}>
          {getIcon()}
        </span>
        <div className="flex-1">
          <p 
            className="text-white text-sm leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast
