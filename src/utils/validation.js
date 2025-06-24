/**
 * Validation utilities for chat app
 */

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: 'Username is required' }
  }
  
  const trimmed = username.trim()
  if (trimmed.length < 2) {
    return { isValid: false, message: 'Username must be at least 2 characters long' }
  }
  
  if (trimmed.length > 20) {
    return { isValid: false, message: 'Username must be less than 20 characters' }
  }
  
  // Check for valid characters (letters, numbers, spaces, basic punctuation)
  const validPattern = /^[a-zA-Z0-9\s\-_.,!?()]+$/
  if (!validPattern.test(trimmed)) {
    return { isValid: false, message: 'Username contains invalid characters' }
  }
  
  return { isValid: true, username: trimmed }
}

export const validateRoomId = (roomId) => {
  if (!roomId || typeof roomId !== 'string') {
    return { isValid: false, message: 'Room ID is required' }
  }
  
  const trimmed = roomId.trim()
  if (trimmed.length < 3) {
    return { isValid: false, message: 'Room ID must be at least 3 characters long' }
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, message: 'Room ID must be less than 50 characters' }
  }
  
  // Check for valid characters (letters, numbers, hyphens, underscores)
  const validPattern = /^[a-zA-Z0-9\-_]+$/
  if (!validPattern.test(trimmed)) {
    return { isValid: false, message: 'Room ID can only contain letters, numbers, hyphens, and underscores' }
  }
  
  return { isValid: true, roomId: trimmed }
}

export const validateStrangerChat = (username) => {
  const usernameValidation = validateUsername(username)
  if (!usernameValidation.isValid) {
    return usernameValidation
  }
  
  // Additional validation for stranger chat
  const cleanUsername = usernameValidation.username.toLowerCase().trim()
  
  // Prevent obvious bot/spam usernames
  const spamPatterns = [
    /^(bot|spam|test|admin|moderator)$/i,
    /^(anonymous|anon|guest|user)(\d+)?$/i,
    /^(.)\1{3,}$/, // Repeated characters like "aaaa"
  ]
  
  for (const pattern of spamPatterns) {
    if (pattern.test(cleanUsername)) {
      return { isValid: false, message: 'Please choose a more unique username' }
    }
  }
  
  return { isValid: true, username: usernameValidation.username }
}

export const validateRoomAccess = (username, roomId) => {
  const usernameValidation = validateUsername(username)
  if (!usernameValidation.isValid) {
    return usernameValidation
  }
  
  const roomValidation = validateRoomId(roomId)
  if (!roomValidation.isValid) {
    return roomValidation
  }
  
  // Check if user is trying to join a room with the same name as their username
  const cleanUsername = usernameValidation.username.toLowerCase().trim()
  const cleanRoomId = roomValidation.roomId.toLowerCase().trim()
  
  if (cleanUsername === cleanRoomId) {
    return { 
      isValid: false, 
      message: 'You cannot join a room with the same name as your username' 
    }
  }
  
  return { 
    isValid: true, 
    username: usernameValidation.username, 
    roomId: roomValidation.roomId 
  }
}

export const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, message: 'Message cannot be empty' }
  }
  
  const trimmed = message.trim()
  if (trimmed.length === 0) {
    return { isValid: false, message: 'Message cannot be empty' }
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, message: 'Message is too long (max 1000 characters)' }
  }
  
  return { isValid: true, message: trimmed }
}
