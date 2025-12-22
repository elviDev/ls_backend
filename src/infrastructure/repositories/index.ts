import { MessageRepository, UserRepository } from '../../domain/repositories';
import { Message, User } from '../../domain/entities';

export class InMemoryMessageRepository implements MessageRepository {
  private messages: Message[] = [];

  async save(message: Message): Promise<Message> {
    const existingIndex = this.messages.findIndex(m => m.id === message.id);
    
    if (existingIndex >= 0) {
      console.log(`📝 Updating existing message ${message.id}`);
      this.messages[existingIndex] = message;
    } else {
      console.log(`➕ Adding new message ${message.id} to broadcast ${message.broadcastId}`);
      this.messages.push(message);
      
      if (this.messages.length > 1000) {
        this.messages = this.messages.slice(-1000);
      }
    }
    
    console.log(`💾 Total messages in repo: ${this.messages.length}`);
    return message;
  }

  async findByBroadcastId(broadcastId: string, limit = 100): Promise<Message[]> {
    const filtered = this.messages.filter(m => m.broadcastId === broadcastId);
    const result = filtered.slice(-limit);
    console.log(`🔍 Found ${result.length} messages for broadcast ${broadcastId} (total: ${this.messages.length})`);
    return result;
  }

  async findById(id: string): Promise<Message | null> {
    const message = this.messages.find(m => m.id === id) || null;
    console.log(`🔍 Finding message ${id}: ${message ? 'found' : 'not found'}`);
    return message;
  }

  async updateLikes(id: string, likes: number): Promise<void> {
    const message = this.messages.find(m => m.id === id);
    if (message) {
      message.likes = likes;
    }
  }
}

export class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>();

  async save(socketId: string, user: User): Promise<void> {
    console.log(`👤 Saving user ${user.username} with role ${user.role} for socket ${socketId}`);
    this.users.set(socketId, user);
  }

  async findBySocketId(socketId: string): Promise<User | null> {
    const user = this.users.get(socketId) || null;
    console.log(`🔍 Finding user for socket ${socketId}: ${user ? `${user.username} (${user.role})` : 'not found'}`);
    return user;
  }

  async remove(socketId: string): Promise<void> {
    this.users.delete(socketId);
  }
}