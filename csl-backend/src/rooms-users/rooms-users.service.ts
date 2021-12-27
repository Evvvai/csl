import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomI } from 'src/room/entities/room.interface';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { RoomsUsers } from './entities/rooms-users.entity';
import { RoomsUsersI } from './entities/rooms-users.interface';

@Injectable()
export class RoomsUsersService {
  constructor(
    @InjectRepository(RoomsUsers)
    private roomsUsersRepository: Repository<RoomsUsers>,
  ) {}

  async addUserToRoom(room: RoomI, user: UserI): Promise<RoomsUsersI> {
    return this.roomsUsersRepository.save({ roomId: room.id, userId: user.id });
  }

  async getRoomByUser(user: UserI): Promise<RoomsUsersI> {
    return this.roomsUsersRepository.findOne({ where: { userId: user.id } });
  }

  async getUsersByRoom(room: RoomI): Promise<UserI[]> {
    const query = await this.roomsUsersRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'users')
      .where('r.roomId = :roomId')
      .setParameters({ roomId: room.id })
      .getMany();

    const users = query.map((x) => x.user);

    return users;
  }

  async removeUser(user: UserI) {
    return this.roomsUsersRepository.delete({ userId: user.id });
  }
}
