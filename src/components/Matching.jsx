import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useAppState } from '../hooks/useAppState'

function Matching({ onCancel }) {
  const [waitingTime, setWaitingTime] = useState(0)
  const [motivationalMessage, setMotivationalMessage] = useState('Finding someone special...')
  const { username } = useAppState()
  useEffect(() => {
    // Messages to rotate through while waiting
    const messages = [
      'Finding someone special...',
      'Looking for interesting people...',
      'Connecting hearts and minds...',
      'Great conversations are worth the wait...',
      'Someone amazing is looking for you too...'
    ]

    // Update waiting time every second
    const timeInterval = setInterval(() => {
      setWaitingTime(prev => prev + 1)
    }, 1000)

    // Rotate motivational messages every 3 seconds
    const messageInterval = setInterval(() => {
      setMotivationalMessage(prev => {
        const currentIndex = messages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % messages.length
        return messages[nextIndex]
      })
    }, 3000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(messageInterval)
    }
  }, [])

  const formatWaitingTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return `${secs}s`
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">      
      <div
        className="text-center max-w-md mx-auto relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >        {/* Loading Animation */}
        <div className="mb-8 flex justify-center">
          <LoadingSpinner size="lg" text="" />
        </div>

        {/* Title */}
        <h2 
          className="text-2xl font-light text-white mb-4"
          style={{
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {motivationalMessage}
        </h2>

        {/* Waiting time */}
        <div 
          className="mb-2"
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Waiting: {formatWaitingTime(waitingTime)}
        </div>

        {/* Description */}
        <p 
          className="mb-8"
          style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '1rem',
            lineHeight: '1.6',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Hey <span className="font-medium text-white">{username}</span>! 
          We're connecting you with someone who's ready for a meaningful conversation.
        </p>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="transition-all duration-300 hover:bg-white hover:bg-opacity-20"
          style={{
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0.75rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Matching
