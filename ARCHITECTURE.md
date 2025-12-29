# Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (React App + Database via Prisma)                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP API Calls
                 │ (Save messages, likes, pins)
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Chat Server)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               server.ts (Entry Point)                 │  │
│  │  • Express app setup                                  │  │
│  │  • HTTP routes (/health, /api/broadcasts)            │  │
│  │  • SSE endpoints                                      │  │
│  └────────┬─────────────────────────────────────┬────────┘  │
│           │                                      │           │
│           ↓                                      ↓           │
│  ┌────────────────┐                    ┌─────────────────┐  │
│  │ Socket Server  │                    │  SSE Manager    │  │
│  │ socket-server  │                    │  broadcast-sse  │  │
│  └────────┬───────┘                    └─────────────────┘  │
│           │                                                  │
│           ↓                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Chat Handlers (chat.handler.ts)             │   │
│  │  • join-broadcast    • send-message                 │   │
│  │  • toggle-like       • toggle-pin                   │   │
│  │  • leave-broadcast   • disconnect                   │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                  │
│           ↓                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Validation Middleware (validation.ts)        │   │
│  │  • validateBroadcastMembership()                    │   │
│  │  • validateStaffPermission()                        │   │
│  │  • emitError()                                      │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                  │
│           ↓                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Chat Service (chat.service.ts)             │   │
│  │  • addUserToBroadcast()                             │   │
│  │  • removeUserFromBroadcast()                        │   │
│  │  • sendMessage()                                    │   │
│  │  • toggleLike()                                     │   │
│  │  • togglePin()                                      │   │
│  │  • broadcastOnlineCount()                           │   │
│  │  • State: broadcastRooms Map                        │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                  │
│           ↓                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          API Client (api-client.ts)                 │   │
│  │  • request()                                        │   │
│  │  • get()                                            │   │
│  │  • post()                                           │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
            │ HTTP Requests
            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND API                              │
│  • POST /api/chat/:broadcastId (save message)               │
│  • POST /api/chat/:broadcastId/:messageId/like              │
│  • POST /api/chat/:broadcastId/:messageId/pin               │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow Examples

### 1. User Sends Message

```
Client (Socket)
    │
    │ emit('send-message', { broadcastId, content, messageType })
    ↓
chat.handler.ts
    │
    │ Extract data, validate
    ↓
validation.ts
    │
    │ validateBroadcastMembership()
    ↓
chat.service.ts
    │
    │ sendMessage(io, broadcastId, messageData)
    ↓
api-client.ts
    │
    │ POST /api/chat/:broadcastId
    ↓
Frontend API
    │
    │ Save to database (Prisma)
    │ Return message object
    ↓
chat.service.ts
    │
    │ Parse likedBy JSON
    │ io.to(broadcastId).emit('chat-message', message)
    ↓
All Clients in Room
    │
    │ Receive new message
```

### 2. Staff Pins Message

```
Client (Socket)
    │
    │ emit('toggle-pin', { messageId, broadcastId })
    ↓
chat.handler.ts
    │
    │ Extract data, validate
    ↓
validation.ts
    │
    │ validateBroadcastMembership() ✓
    │ validateStaffPermission() ✓
    ↓
chat.service.ts
    │
    │ togglePin(io, broadcastId, messageId)
    ↓
api-client.ts
    │
    │ POST /api/chat/:broadcastId/:messageId/pin
    ↓
Frontend API
    │
    │ Update database
    │ Return { isPinned: boolean }
    ↓
chat.service.ts
    │
    │ io.to(broadcastId).emit('message-pinned', { messageId, isPinned })
    ↓
All Clients in Room
    │
    │ Update UI to show pinned message
```

### 3. User Joins Broadcast

```
Client (Socket)
    │
    │ emit('join-broadcast', { broadcastId, userId, username, userType, role })
    ↓
chat.handler.ts
    │
    │ Validate required fields
    │ socket.join(broadcastId)
    │ Store user data in socket.data
    ↓
chat.service.ts
    │
    │ addUserToBroadcast(broadcastId, user)
    │ broadcastOnlineCount(io, broadcastId)
    ↓
Socket.IO
    │
    │ io.to(broadcastId).emit('online-users', count)
    ↓
All Clients in Room
    │
    │ Update online user count display
```

## Module Responsibilities

### server.ts
**Responsibility**: Application entry point and HTTP routing
- Express app configuration
- CORS setup
- HTTP endpoints for health checks
- SSE endpoints for broadcast notifications
- Server lifecycle management

### config/environment.ts
**Responsibility**: Configuration management
- Load environment variables
- Provide typed config object
- Single source of truth for configuration

### socket/socket-server.ts
**Responsibility**: Socket.IO initialization
- Create Socket.IO server
- Configure CORS for WebSocket
- Set up connection handler
- Attach chat handlers

### socket/handlers/chat.handler.ts
**Responsibility**: Socket event handling
- Listen to socket events
- Extract and validate event data
- Call appropriate service methods
- Handle errors and emit responses

### socket/middleware/validation.ts
**Responsibility**: Reusable validation logic
- Validate broadcast membership
- Validate staff permissions
- Emit error messages
- Type definitions for socket data

### services/chat.service.ts
**Responsibility**: Business logic and state management
- Manage broadcast rooms state
- Coordinate between handlers and API client
- Emit socket events after operations
- Calculate online counts

### http/api-client.ts
**Responsibility**: HTTP communication abstraction
- Make requests to frontend API
- Handle request/response lifecycle
- Centralized error handling
- Logging and monitoring

### infrastructure/sse/broadcast-sse-manager.ts
**Responsibility**: Server-Sent Events for broadcast notifications
- Manage SSE client connections
- Broadcast events to all clients
- Handle client lifecycle

### utils/logger.ts
**Responsibility**: Centralized logging
- Structured logging with timestamps
- Log levels (INFO, WARN, ERROR, DEBUG)
- Consistent log format

## Design Principles Applied

### 1. Single Responsibility Principle (SRP)
Each module has one clear purpose and one reason to change.

### 2. Dependency Inversion Principle (DIP)
High-level modules (handlers) don't depend on low-level modules (API calls).
Both depend on abstractions (service interfaces).

### 3. Don't Repeat Yourself (DRY)
Validation logic extracted to reusable middleware.
API client logic centralized.

### 4. Separation of Concerns (SoC)
Configuration, business logic, event handling, and HTTP communication
are all separated into distinct modules.

### 5. Open/Closed Principle (OCP)
Easy to add new event handlers without modifying existing code.
Easy to add new validation rules.

## Benefits of This Architecture

✅ **Maintainability**: Changes are localized to specific modules
✅ **Testability**: Each module can be tested independently
✅ **Readability**: Clear structure, easy to find code
✅ **Scalability**: Easy to add new features
✅ **Debugging**: Clear flow, structured logging
✅ **Onboarding**: New developers can understand quickly
