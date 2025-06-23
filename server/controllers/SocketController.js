const RoomService = require('../services/RoomService');
const StrangerChatService = require('../services/StrangerChatService');
const MessageUtils = require('../services/MessageUtils');

class SocketController {
  constructor(io) {
    this.io = io;
    this.roomService = new RoomService();
    this.strangerChatService = new StrangerChatService();
  }

  handleConnection(socket) {
    console.log('User connected:', socket.id);

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

      console.log(`${username} joined room ${roomId}`);
    });
  }

  handleFindStranger(socket) {
    socket.on('find-stranger', (data) => {
      const { username } = data;
      socket.username = username;

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

        console.log(`Matched ${username} with ${partner.username}`);
      } else {
        this.strangerChatService.addToWaitingList(socket);
        socket.emit('waiting-for-stranger');
        console.log(`${username} is waiting for a stranger`);
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
      if (socket.strangerChatId) {
        socket.to(socket.strangerChatId).emit('stranger-left');
        this.strangerChatService.removeStrangerChat(socket.strangerChatId);
        socket.leave(socket.strangerChatId);
        socket.strangerChatId = null;
      }
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
      }

      // Handle stranger chat disconnection
      if (socket.strangerChatId) {
        socket.to(socket.strangerChatId).emit('stranger-left');
        this.strangerChatService.removeStrangerChat(socket.strangerChatId);
      }
    });
  }
}

module.exports = SocketController;
