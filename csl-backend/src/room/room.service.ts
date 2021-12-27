import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { CreateRoomInput } from './dto/create-room.input';
import { Room } from './entities/room.entity';
import { RoomI } from './entities/room.interface';
import { StatusRoom } from './entities/status-room';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,

    private roomsUsersService: RoomsUsersService,
  ) {}

  async create(user: UserI, createRoomInput: CreateRoomInput) {
    const room = await this.roomRepository.create({
      name: 'Team_' + user.username,
      maxPlayers: createRoomInput.maxPlayers,
      captainId: user.id,
    });

    const newRoom = await this.roomRepository.save(room);
    await this.roomsUsersService.addUserToRoom(newRoom, user);

    return await this.roomRepository.save(newRoom);
  }

  async deleteRoom(room: RoomI) {
    return this.roomRepository.delete({ id: room.id });
  }

  async remove(user: UserI) {
    const room = await this.roomRepository.delete({ captainId: user.id });
    return room.affected > 0 ? true : false;
  }

  async deleteAllRooms() {
    await this.roomRepository.createQueryBuilder().delete().execute();
  }

  async getRoomsForUser(user: UserI): Promise<RoomI> {
    const room = await this.roomsUsersService.getRoomByUser(user);

    if (!room) return new Room();
    return await this.roomRepository.findOne({ where: { id: room.roomId } });
  }

  async getRoomById(id: number): Promise<RoomI> {
    return await this.roomRepository.findOne({ where: { id } });
  }

  async updateStatus(id: number, status: StatusRoom) {
    // return await this.roomRepository.save({
    //   id,
    //   status,
    // });

    return this.roomRepository
      .createQueryBuilder()
      .update(Room)
      .set({ status: status })
      .where('id = :id', { id: id })
      .execute();
  }
}
