export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const validateUsername = (username) => {
  return username.trim().length >= 2 && username.trim().length <= 20
}

export const validateRoomId = (roomId) => {
  return roomId.trim().length >= 3 && roomId.trim().length <= 10
}
