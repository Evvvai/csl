import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomI } from 'src/room/entities/room.interface';
import { In, Repository } from 'typeorm';
import { ConnectedRoom } from './entities/connected-room.entity';
import { ConnectedRoomI } from './entities/connected-room.interface';

@Injectable()
export class ConnectedRoomService {
  constructor(
    @InjectRepository(ConnectedRoom)
    private connectedRoomRepository: Repository<ConnectedRoom>,
  ) {}

  async findRoomBySocketIds(socketId: string[]): Promise<ConnectedRoom> {
    return this.connectedRoomRepository.findOne({
      where: { socketId: In(socketId) },
    });
  }

  async create(connectedRoom: ConnectedRoomI): Promise<ConnectedRoomI> {
    return this.connectedRoomRepository.save(connectedRoom);
  }

  async getAllConnectionByRoom(room: RoomI) {
    return this.connectedRoomRepository.find({
      where: { roomId: room.id },
    });
  }

  async deleteAllConnection() {
    await this.connectedRoomRepository.createQueryBuilder().delete().execute();
  }

  async findByRoom(room: RoomI): Promise<ConnectedRoomI[]> {
    return this.connectedRoomRepository.find({ where: { roomId: room.id } });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedRoomRepository.delete({ socketId });
  }

  async deleteBySocketIds(socketIds: string[]) {
    return this.connectedRoomRepository.delete({
      socketId: In(socketIds),
    });
  }
}
