import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Logger } from '@nestjs/common';

export class RediskaService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // User add/remove socket connection
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

  // User add/remove room connection
  async addRoom(roomId: number, userId: number, socketId: string) {
    this.redis.hset('room:' + roomId, userId, socketId);
  }
  async removeRoom(roomId: number, userId: number, socketId: string) {
    this.redis.hset('room:' + roomId, userId, socketId);
  }

  // Clear redis db
  async clear() {
    // this.redis.flushall();
  }
}
