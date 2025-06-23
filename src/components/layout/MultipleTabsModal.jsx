function MultipleTabsModal() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        className="p-8 max-w-md w-full mx-4"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem'
        }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          <h2 
            className="text-xl font-light text-white mb-4"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Multiple Tabs Detected
          </h2>
          
          <p 
            className="text-sm mb-6"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.5'
            }}
          >
            The chat app is already open in another tab. Please close other tabs to continue using the app.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 rounded-xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #333333, #000000)',
              color: '#ffffff',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '500'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultipleTabsModal
