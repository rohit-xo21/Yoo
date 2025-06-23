class RoomService {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
  }

  addUserToRoom(roomId, user) {
    this.createRoom(roomId);
    this.rooms.get(roomId).add(user);
  }

  removeUserFromRoom(roomId, userId) {
    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      room.forEach(user => {
        if (user.id === userId) {
          room.delete(user);
        }
      });
    }
  }

  getRoomUsers(roomId) {
    if (this.rooms.has(roomId)) {
      return Array.from(this.rooms.get(roomId));
    }
    return [];
  }

  roomExists(roomId) {
    return this.rooms.has(roomId);
  }
}

module.exports = RoomService;
