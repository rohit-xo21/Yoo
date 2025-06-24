import { useState, useEffect } from 'react'

export const useAppState = () => {
  const [currentView, setCurrentView] = useState('nickname')
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [chatType, setChatType] = useState('')
  const [showNicknameModal, setShowNicknameModal] = useState(true)
  const [isRoomCreator, setIsRoomCreator] = useState(false)

  // Check for stored username on app load
  useEffect(() => {
    const storedUsername = localStorage.getItem('chatapp_username')
    
    if (storedUsername) {
      setUsername(storedUsername)
      setCurrentView('home')
      setShowNicknameModal(false)
    }
  }, [])

  const setUsernameAndStore = (newUsername) => {
    setUsername(newUsername)
    localStorage.setItem('chatapp_username', newUsername)
  }

  const resetToHome = () => {
    setCurrentView('home')
    setRoomId('')
    setChatType('')
    setIsRoomCreator(false)
  }

  const logout = () => {
    setUsername('')
    setCurrentView('nickname')
    setShowNicknameModal(true)
    localStorage.removeItem('chatapp_username')
    resetToHome()
  }

  return {
    currentView,
    setCurrentView,
    username,
    setUsername: setUsernameAndStore,
    roomId,
    setRoomId,
    chatType,
    setChatType,
    showNicknameModal,
    setShowNicknameModal,
    isRoomCreator,
    setIsRoomCreator,
    resetToHome,
    logout
  }
}
