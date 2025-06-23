class MessageUtils {
  static createMessage(username, message) {
    return {
      id: Date.now(),
      username,
      message,
      timestamp: new Date().toISOString()
    };
  }

  static createSystemMessage(message) {
    return {
      id: Date.now(),
      type: 'system',
      message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = MessageUtils;
