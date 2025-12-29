# Radio Station Chat Backend

A standalone, production-ready chat backend for radio station broadcasts with real-time messaging, likes, pins, and moderation features.

## Features

✅ **Real-time Chat** - WebSocket-based chat using Socket.IO
✅ **Message Management** - Send, like, and pin messages
✅ **Role-Based Permissions** - Staff can moderate and pin messages
✅ **Broadcast Rooms** - Isolated chat rooms per broadcast
✅ **Online User Tracking** - Real-time online user counts
✅ **Server-Sent Events** - Broadcast start/end notifications
✅ **JWT Authentication** - Secure user authentication
✅ **Database Persistence** - PostgreSQL with Prisma ORM
✅ **Structured Logging** - Comprehensive logging for debugging
✅ **TypeScript** - Full type safety

## Architecture

### Clean Separation of Concerns

```
src/
├── server.ts                   # Entry point
├── config/                     # Configuration
├── lib/                        # Shared utilities (Prisma)
├── middleware/                 # Auth middleware
├── routes/                     # HTTP API routes
├── services/                   # Business logic
├── socket/                     # WebSocket handling
│   ├── handlers/               # Event handlers
│   ├── middleware/             # Socket validation
│   └── socket-server.ts        # Socket.IO setup
├── infrastructure/             # External integrations (SSE)
└── utils/                      # Utilities (logger)
```

### Technology Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **WebSocket**: Socket.IO
- **Database**: PostgreSQL + Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Logging**: Custom structured logger

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Build TypeScript
npm run build

# Start server
npm start
```

### Development

```bash
# Run in watch mode
npm run dev
```

### Configuration

Create a `.env` file (see `.env.example`):

```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Same database as frontend
DATABASE_URL=postgresql://user:password@host:port/database

# Must match frontend's JWT_SECRET
JWT_SECRET=your-secret-key
```

## API Documentation

### HTTP Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| GET | `/api/chat/:broadcastId` | Get messages | No |
| POST | `/api/chat/:broadcastId` | Send message | Optional |
| POST | `/api/chat/:broadcastId/:messageId/like` | Toggle like | Optional |
| POST | `/api/chat/:broadcastId/:messageId/pin` | Pin message | Yes (Moderator) |
| GET | `/api/broadcasts/events` | SSE connection | No |
| GET | `/api/broadcasts/events/stats` | SSE stats | No |
| POST | `/api/broadcasts/notify/started` | Broadcast started | No |
| POST | `/api/broadcasts/notify/ended` | Broadcast ended | No |

### WebSocket Events

#### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join-broadcast` | `{broadcastId, userId, username, userType, role}` | Join a broadcast room |
| `send-message` | `{broadcastId, content, messageType}` | Send a message |
| `toggle-like` | `{broadcastId, messageId}` | Like/unlike a message |
| `toggle-pin` | `{broadcastId, messageId}` | Pin/unpin a message |
| `leave-broadcast` | `broadcastId` | Leave a broadcast room |

#### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `online-users` | `count` | Online user count updated |
| `chat-message` | `message` | New message received |
| `message-liked` | `{messageId, likes, likedBy}` | Message like toggled |
| `message-pinned` | `{messageId, isPinned}` | Message pin toggled |
| `error` | `{message}` | Error occurred |

## Project Structure

### Key Files

- **[server.ts](src/server.ts)** - Express app setup and HTTP routes
- **[chat.service.ts](src/services/chat.service.ts)** - Chat business logic and state management
- **[chat.handler.ts](src/socket/handlers/chat.handler.ts)** - WebSocket event handlers
- **[chat.routes.ts](src/routes/chat.routes.ts)** - HTTP API endpoints for chat
- **[auth.ts](src/middleware/auth.ts)** - JWT authentication and authorization
- **[validation.ts](src/socket/middleware/validation.ts)** - Socket validation middleware

### Documentation

- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Complete migration guide from old architecture
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed architecture documentation
- **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)** - What changed and why

## Authentication

The backend uses JWT tokens for authentication:

```typescript
// Include token in HTTP requests
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

### User Types

- **user** - Regular users (can send messages, like)
- **staff** - Staff members (can send messages, like, moderate)

### Moderator Roles

Staff with these roles can pin messages:
- ADMIN
- HOST
- PRODUCER

## Development

### Available Scripts

```bash
npm run dev         # Run in development mode
npm run build       # Build TypeScript
npm start           # Start production server
npm run clean       # Clean dist folder
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Prisma Studio
```

### Logging

The logger provides structured logging:

```typescript
logger.info('Message', { key: 'value' });
logger.warn('Warning', { key: 'value' });
logger.error('Error', error);
logger.debug('Debug info', { key: 'value' }); // Only in development
```

### Database Schema

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema.

Key models:
- **ChatMessage** - Chat messages with likes, pins, etc.
- **User** - Regular users
- **Staff** - Staff members with roles

## Deployment

### Environment Variables

Ensure these are set in production:

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure production `DATABASE_URL`
- [ ] Set correct `FRONTEND_URL` for CORS
- [ ] Enable HTTPS/TLS
- [ ] Set up database connection pooling
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Enable error tracking (Sentry, etc.)
- [ ] Set up health checks
- [ ] Configure auto-restart on crash

### Scaling Considerations

For high-traffic deployments:

1. **Redis Adapter** - Use Socket.IO Redis adapter for multiple instances
2. **Load Balancer** - Configure sticky sessions
3. **Database** - Enable connection pooling, read replicas
4. **Caching** - Add Redis for frequently accessed data
5. **CDN** - Serve static assets via CDN

## Troubleshooting

### Common Issues

**Build fails**
```bash
npm run clean
npm run db:generate
npm run build
```

**Database connection errors**
- Check `DATABASE_URL` format
- Verify database is running
- Test connection: `psql $DATABASE_URL`

**WebSocket connection fails**
- Check CORS settings
- Verify `FRONTEND_URL` is correct
- Check firewall/network settings

**Authentication errors**
- Ensure `JWT_SECRET` matches frontend
- Verify token format and expiration
- Check user exists in database

## Contributing

This project follows clean architecture principles:

1. **Separation of Concerns** - Each module has one responsibility
2. **Dependency Inversion** - High-level modules don't depend on low-level
3. **DRY** - Don't Repeat Yourself
4. **SOLID** - Follow SOLID principles

### Code Style

- Use TypeScript
- Follow existing patterns
- Add structured logging
- Write descriptive commit messages

## License

MIT

## Support

For issues or questions:
1. Check [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
2. Review [ARCHITECTURE.md](ARCHITECTURE.md)
3. Check server logs for errors
4. Open an issue with reproduction steps

---

**Built with ❤️ for radio stations**
