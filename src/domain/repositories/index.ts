import { Message, User } from '../entities';

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  findByBroadcastId(broadcastId: string, limit?: number): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  updateLikes(id: string, likes: number): Promise<void>;
}

export interface UserRepository {
  save(socketId: string, user: User): Promise<void>;
  findBySocketId(socketId: string): Promise<User | null>;
  remove(socketId: string): Promise<void>;
}