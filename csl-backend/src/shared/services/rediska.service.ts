import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Logger } from '@nestjs/common';

export class RediskaService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * User socket connection
   */
  async add(userId: number, socketId: string) {
    this.redis.sadd('user:' + userId, socketId);
  }
  async remove(userId: number, socketId: string) {
    return this.redis.srem('user:' + userId, socketId);
  }
  async ammount(userId: number) {
    return this.redis.scard('user:' + userId);
  }
  async getAll(userId: number) {
    return this.redis.smembers('user:' + userId);
  }
  async getAllByIds(userId: number[]) {
    const keys = await this.redis.keys('user:*');
    const splitKeys = keys.map((val) => {
      const key = val.split(':')[1];
      if (userId.find((x) => x === +key)) return val;
    });

    const online = [];
    for (let i = 0; i < splitKeys.length; i++) {
      if (splitKeys[i]) {
        const friendsSocketIds = await this.redis.smembers(splitKeys[i]);
        online.push(...friendsSocketIds);
      }
    }

    return online;
  }

  /**
   * User room connection
   */
  async getAllByRoom(roomId: number): Promise<any> {
    return this.redis.hgetall('room:' + roomId);
  }
  async addToRoom(roomId: number, userId: number, socketId: string) {
    this.redis.hset('room:' + roomId, socketId, userId);
  }
  async removeFromRoom(roomId: number, userId: number) {
    const socketIds = await this.getAllByRoom(roomId);

    Object.keys(socketIds).forEach(async (socketId) => {
      if (socketIds[socketId] === userId.toString())
        this.redis.hdel('room:' + roomId, socketId);
    });
  }
  async removeRoom(roomId: number) {
    this.redis.del('room:' + roomId);
  }
  async removeFromRoomBySocketId(socketId: string) {
    const keys = await this.redis.keys('room:*');
    keys.forEach((key) => {
      this.redis.hdel(key, socketId);
    });
  }

  /**
   * User lobby connection
   */
  async addToLobby(lobbyId: number, userId: number, socketId: string) {
    this.redis.hset('lobby:' + lobbyId, socketId, userId);
  }
  async getAllByLobby(lobbyId: number): Promise<any> {
    return this.redis.hgetall('lobby:' + lobbyId);
  }
  async removeLobby(lobbyId: number) {
    this.redis.del('lobby:' + lobbyId);
  }
  async removeFromLobby(lobbyId: number, userId: number) {
    const socketIds = await this.getAllByRoom(lobbyId);

    Object.keys(socketIds).forEach(async (socketId) => {
      if (socketIds[socketId] === userId.toString())
        this.redis.hdel('lobby:' + lobbyId, socketId);
    });
  }
  async removeFromLobbyBySocketId(socketId: string) {
    const keys = await this.redis.keys('lobby:*');
    keys.forEach((key) => {
      this.redis.hdel(key, socketId);
    });
  }

  /**
   * Clear redis db
   */
  async clear() {
    this.redis.flushall();
    Logger.debug(' >< Redis cleared');
  }
}
