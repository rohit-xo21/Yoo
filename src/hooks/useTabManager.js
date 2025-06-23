import { useState, useEffect } from 'react'

export const useTabManager = () => {
  const [isActiveTab, setIsActiveTab] = useState(true)
  const [tabId] = useState(() => Math.random().toString(36).substr(2, 9))

  useEffect(() => {
    const activeTabId = localStorage.getItem('chatapp_active_tab')
    
    // Check if another tab is already active
    if (activeTabId && activeTabId !== tabId) {
      alert('Chat app is already open in another tab. Please close other tabs to continue.')
      setIsActiveTab(false)
      return
    }
    
    // Mark this tab as active
    localStorage.setItem('chatapp_active_tab', tabId)
    setIsActiveTab(true)

    // Listen for storage changes (other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'chatapp_active_tab' && e.newValue !== tabId) {
        alert('Chat app is now active in another tab. This tab will be disabled.')
        setIsActiveTab(false)
      }
    }

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const currentActiveTab = localStorage.getItem('chatapp_active_tab')
        if (currentActiveTab !== tabId) {
          setIsActiveTab(false)
          alert('Chat app is active in another tab. Please close other tabs to continue.')
        }
      }
    }

    // Cleanup when tab closes
    const handleBeforeUnload = () => {
      const currentActiveTab = localStorage.getItem('chatapp_active_tab')
      if (currentActiveTab === tabId) {
        localStorage.removeItem('chatapp_active_tab')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      const currentActiveTab = localStorage.getItem('chatapp_active_tab')
      if (currentActiveTab === tabId) {
        localStorage.removeItem('chatapp_active_tab')
      }
    }
  }, [tabId])

  return { isActiveTab, tabId }
}
