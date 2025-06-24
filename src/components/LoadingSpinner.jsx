function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className="flex items-center gap-3">
      <div 
        className={`${sizeClasses[size]} border-2 border-white/20 border-t-white rounded-full animate-spin`}
        aria-label="Loading"
      />
      {text && (
        <span 
          className="text-white/80 text-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {text}
        </span>
      )}
    </div>
  )
}

export default LoadingSpinner
