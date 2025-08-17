const RoomService = require('../services/RoomService');
const StrangerChatService = require('../services/StrangerChatService');
const MessageUtils = require('../services/MessageUtils');

class SocketController {  constructor(io) {
    this.io = io;
    this.roomService = new RoomService();
    this.strangerChatService = new StrangerChatService();
    this.strangerChatService.setIO(io); // Set the io instance for broadcasting
  }

  handleConnection(socket) {
    this.handleJoinRoom(socket);
    this.handleFindStranger(socket);
    this.handleSendMessage(socket);
    this.handleLeaveRoom(socket);
    this.handleLeaveStrangerChat(socket);
    this.handleDisconnection(socket);
  }

  handleJoinRoom(socket) {
    socket.on('join-room', (data) => {
      const { roomId, username } = data;
      socket.join(roomId);
      socket.username = username;
      socket.roomId = roomId;

      const user = { id: socket.id, username };
      this.roomService.addUserToRoom(roomId, user);

      // Notify others in the room
      const users = this.roomService.getRoomUsers(roomId);
      socket.to(roomId).emit('user-joined', { username, users });

      // Send current users to the new user
      socket.emit('room-users', users);
    });
  }
  handleFindStranger(socket) {
    socket.on('find-stranger', (data) => {
      const { username } = data;
      socket.username = username;

      // First check if user is already waiting
      if (this.strangerChatService.waitingUsers.some(user => user.username === username)) {
        socket.emit('already-waiting', { message: 'You are already in the queue' });
        return;
      }

      const match = this.strangerChatService.findMatch(socket);

      if (match) {
        const { partner, chatId } = match;
        
        socket.join(chatId);
        partner.join(chatId);
        
        socket.strangerChatId = chatId;
        partner.strangerChatId = chatId;

        // Notify both users
        socket.emit('stranger-matched', { 
          chatId,
          partnerUsername: partner.username 
        });
        partner.emit('stranger-matched', { 
          chatId,
          partnerUsername: username 
        });
      } else {
        const added = this.strangerChatService.addToWaitingList(socket);
        if (added) {
          socket.emit('waiting-for-stranger', { 
            waitingCount: this.strangerChatService.waitingUsers.length 
          });
          this.strangerChatService.broadcastWaitingUpdate();
        } else {
          socket.emit('already-waiting', { message: 'You are already in the queue' });
        }
      }
    });
  }
  handleSendMessage(socket) {
    socket.on('send-message', (data) => {
      const { message, roomId, chatType } = data;
      const messageData = MessageUtils.createMessage(socket.username, message);

      if (chatType === 'room' && roomId) {
        this.io.to(roomId).emit('receive-message', messageData);
      } else if (chatType === 'stranger' && socket.strangerChatId) {
        this.io.to(socket.strangerChatId).emit('receive-message', messageData);
      }
    });
  }

  handleLeaveRoom(socket) {
    socket.on('leave-room', () => {
      if (socket.roomId && this.roomService.roomExists(socket.roomId)) {
        this.roomService.removeUserFromRoom(socket.roomId, socket.id);
        const users = this.roomService.getRoomUsers(socket.roomId);

        socket.to(socket.roomId).emit('user-left', {
          username: socket.username,
          users
        });

        socket.leave(socket.roomId);
        socket.roomId = null;
      }
    });
  }
  handleLeaveStrangerChat(socket) {
    socket.on('leave-stranger-chat', () => {
      // Remove from waiting list if still waiting
      this.strangerChatService.removeFromWaitingList(socket.id);
      this.strangerChatService.broadcastWaitingUpdate();
      
      if (socket.strangerChatId) {
        // Notify the partner that user left and they should go home
        socket.to(socket.strangerChatId).emit('stranger-left', {
          reason: 'partner-left',
          message: 'Your chat partner has left. Redirecting to home...',
          redirectToHome: true
        });
        
        this.strangerChatService.removeStrangerChat(socket.strangerChatId);
        socket.leave(socket.strangerChatId);
        socket.strangerChatId = null;
      }
      
      console.log(`${socket.username || 'User'} left stranger chat`);
    });
  }

  handleDisconnection(socket) {
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Remove from waiting list
      this.strangerChatService.removeFromWaitingList(socket.id);

      // Handle room disconnection
      if (socket.roomId && this.roomService.roomExists(socket.roomId)) {
        this.roomService.removeUserFromRoom(socket.roomId, socket.id);
        const users = this.roomService.getRoomUsers(socket.roomId);

        socket.to(socket.roomId).emit('user-left', {
          username: socket.username,
          users
        });
      }      // Handle stranger chat disconnection
      if (socket.strangerChatId) {
        // Notify the partner that user disconnected and they should go home
        socket.to(socket.strangerChatId).emit('stranger-left', {
          reason: 'partner-disconnected',
          message: 'Your chat partner has disconnected. Redirecting to home...',
          redirectToHome: true
        });
        this.strangerChatService.removeStrangerChat(socket.strangerChatId);
      }
    });
  }
}

module.exports = SocketController;
