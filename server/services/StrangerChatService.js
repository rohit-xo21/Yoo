class StrangerChatService {
  constructor() {
    this.waitingUsers = [];
    this.strangerChats = new Map();
    this.io = null; // Will be set by SocketController
  }

  // Set the io instance for broadcasting
  setIO(io) {
    this.io = io;
  }
  addToWaitingList(socket) {
    // Prevent duplicate entries - remove any existing entry for this user
    this.removeFromWaitingList(socket.id);
    
    // Also prevent adding users who already have the same username
    const existingUser = this.waitingUsers.find(user => user.username === socket.username);
    if (existingUser) {
      console.log(`User ${socket.username} already waiting, not adding duplicate`);
      return false;
    }
    
    this.waitingUsers.push(socket);
    console.log(`Added ${socket.username} to waiting list. Queue: ${this.waitingUsers.length}`);
    return true;
  }

  removeFromWaitingList(socketId) {
    const index = this.waitingUsers.findIndex(user => user.id === socketId);
    if (index !== -1) {
      this.waitingUsers.splice(index, 1);
    }
  }
  findMatch(socket) {
    // Filter out users with the same username to prevent self-matching
    const availableUsers = this.waitingUsers.filter(user => 
      user.username !== socket.username && user.id !== socket.id
    );
    
    if (availableUsers.length > 0) {
      const partner = availableUsers.shift();
      // Remove the partner from the original waiting list
      this.removeFromWaitingList(partner.id);
      
      const chatId = `${socket.id}-${partner.id}`;
      
      this.strangerChats.set(chatId, [socket.id, partner.id]);
      
      console.log(`Matching ${socket.username} with ${partner.username} (Chat ID: ${chatId})`);
      
      return {
        partner,
        chatId
      };
    }
    return null;
  }

  removeStrangerChat(chatId) {
    if (this.strangerChats.has(chatId)) {
      this.strangerChats.delete(chatId);
    }
  }

  isWaiting() {
    return this.waitingUsers.length > 0;
  }

  broadcastWaitingUpdate() {
    if (this.io) {
      const waitingCount = this.waitingUsers.length;
      // Broadcast to all users currently waiting
      this.waitingUsers.forEach(user => {
        user.emit('waiting-update', {
          message: `${waitingCount} users waiting`,
          waitingCount: waitingCount
        });
      });
    }
  }
}

module.exports = StrangerChatService;
