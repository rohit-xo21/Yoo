class StrangerChatService {
  constructor() {
    this.waitingUsers = [];
    this.strangerChats = new Map();
  }

  addToWaitingList(socket) {
    this.waitingUsers.push(socket);
  }

  removeFromWaitingList(socketId) {
    const index = this.waitingUsers.findIndex(user => user.id === socketId);
    if (index !== -1) {
      this.waitingUsers.splice(index, 1);
    }
  }

  findMatch(socket) {
    if (this.waitingUsers.length > 0) {
      const partner = this.waitingUsers.shift();
      const chatId = `${socket.id}-${partner.id}`;
      
      this.strangerChats.set(chatId, [socket.id, partner.id]);
      
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
}

module.exports = StrangerChatService;
