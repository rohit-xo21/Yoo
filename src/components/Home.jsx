import React from 'react'

function Home({ username, onChatWithStranger }) {
  return (
    <div className="min-h-screen relative overflow-hidden">      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 
            className="mb-8 text-white tracking-tight italic"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '300',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            "Every stranger is a friend you haven't met yet"
          </h1>
          
          <p 
            className="mb-12 max-w-2xl mx-auto"
            style={{
              fontSize: '1.2rem',
              fontWeight: '400',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.85)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            Hey <span className="font-medium text-white">{username}</span>! 
            Connect with people from around the world. Share stories, make friends, 
            and discover new perspectives through meaningful conversations.
          </p>          {/* Main CTA Button */}
          <button
            onClick={onChatWithStranger}
            className="transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
            style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '500',
              color: '#ffffff',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.2))'
              e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))'
              e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            Chat with Stranger
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
