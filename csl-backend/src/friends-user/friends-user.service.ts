import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { FriendsUser } from './entities/friends-user.entity';
import { FriendsUserI } from './entities/friends-user.interface';

@Injectable()
export class FriendsUserService {
  constructor(
    @InjectRepository(FriendsUser)
    private friendsUserRepository: Repository<FriendsUser>,
  ) {}

  async addFriends(user: UserI, friends: UserI[]) {
    const resQuary: FriendsUserI[] = [];

    friends.forEach((val) => {
      resQuary.push({
        userId: user.id,
        friendId: val.id,
      });
      resQuary.push({
        userId: val.id,
        friendId: user.id,
      });
    });

    return this.friendsUserRepository.save(resQuary);
  }

  async getAllFriends(userId: number) {
    return this.friendsUserRepository.find({
      where: {
        userId: userId,
      },
    });
  }
}
