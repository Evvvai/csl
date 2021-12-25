import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { ConnectedUser } from './entities/connected-user.entity';
import { ConnectedUserI } from './entities/connected-user.interface';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUser)
    private connectedUsersRepository: Repository<ConnectedUser>,
  ) {}

  async findConnect(user: UserI): Promise<ConnectedUser[]> {
    return this.connectedUsersRepository.find({
      where: { userId: user.id },
    });
  }

  async connectUser(connectUser: ConnectedUserI): Promise<ConnectedUser> {
    return this.connectedUsersRepository.save(connectUser);
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUsersRepository.delete({ socketId });
  }

  async deleteAllConnection() {
    await this.connectedUsersRepository.createQueryBuilder().delete().execute();
  }
}
