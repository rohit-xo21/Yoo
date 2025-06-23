function Matching({ username, onCancel }) {
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
      >
        {/* Loading Animation */}
        <div className="mb-8 flex justify-center">
          <div 
            className="rounded-full border-white border-opacity-30 animate-spin"
            style={{
              width: '3rem',
              height: '3rem',
              borderWidth: '3px',
              borderTopColor: '#ffffff'
            }}
          />
        </div>

        {/* Title */}
        <h2 
          className="text-2xl font-light text-white mb-4"
          style={{
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Finding someone special...
        </h2>

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
