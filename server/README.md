# Server Structure

This server is organized using a modular architecture for better maintainability and readability.

## Directory Structure

```
server/
├── config/
│   └── index.js              # Application configuration
├── controllers/
│   └── SocketController.js   # Socket.IO event handlers
├── services/
│   ├── RoomService.js        # Room management logic
│   ├── StrangerChatService.js # Stranger chat matching logic
│   └── MessageUtils.js       # Message formatting utilities
├── package.json              # Server dependencies
└── server.js                 # Main server entry point
```

## Components

### Config (`config/index.js`)
- Contains all configuration settings
- Port, CORS settings, static file paths
- Environment-specific configurations

### Controllers (`controllers/SocketController.js`)
- Handles all Socket.IO events
- Coordinates between different services
- Manages socket connections and disconnections

### Services
- **RoomService**: Manages chat rooms, users in rooms
- **StrangerChatService**: Handles stranger matching and chat sessions
- **MessageUtils**: Utility functions for message formatting

### Main Server (`server.js`)
- Express server setup
- Socket.IO initialization
- Static file serving
- Route handling

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Maintainability**: Easy to find and modify specific functionality
3. **Testability**: Individual components can be tested in isolation
4. **Scalability**: Easy to add new features without cluttering main file
5. **Readability**: Clean, organized code structure

## Usage

The main server file is now much cleaner and focuses only on:
- Setting up the Express server
- Initializing Socket.IO
- Connecting controllers and services
- Serving static files

All business logic is separated into appropriate service classes.
