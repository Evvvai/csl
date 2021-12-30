import { STEAM_API_KEY } from '@environments';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { GetPlayerSummaries } from 'src/auth/steamapi-auth.service';
import { FriendsUserService } from 'src/friends-user/friends-user.service';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserI } from './entities/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private friendsUserService: FriendsUserService,

    private readonly httpService: HttpService,
  ) {}

  async updateFriends(user: UserI) {
    const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${STEAM_API_KEY}&steamid=${user.steamId64}&relationship=friend`;
    const friends = (await lastValueFrom(this.httpService.get<any>(url))).data
      .friendslist.friends;

    const friendsSteamid = friends.map((x) => x.steamid);
    const possible = await this.getAllPossibleFriends(user, friendsSteamid);

    this.friendsUserService.addFriends(user, possible);

    return possible;
  }

  async getAllPossibleFriends(
    user: UserI,
    friendsSteamid: string[],
  ): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: { steamId64: In(friendsSteamid) },
    });

    const friends = await this.friendsUserService.getAllFriends(user.id);

    const possible = users.filter((x) => {
      const gg = friends.find((y) => {
        return y.friendId === x.id;
      });

      if (gg === undefined) return true;
      return false;
    });

    // console.log('users', users);
    // console.log('friends', friends);
    // console.log('possible', possible);

    return possible;
  }

  async getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUserByUsername(login: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        login,
      },
    });
  }

  async updateAvatar(user: User, url: string) {
    user.avatarCustom = url;
    this.usersRepository.save(user);
    return user;
  }

  async updateDashboard(user: User, url: string) {
    user.dashboard = url;
    this.usersRepository.save(user);
    return user;
  }

  // Steam
  async findUserBySteamId64(steamId64: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        steamId64: steamId64,
      },
    });
  }

  async registerUser(profile: GetPlayerSummaries): Promise<User> {
    const user = new User();
    user.steamId64 = profile.steamid;
    user.username = profile.personaname;
    user.profileurl = profile.profileurl;
    user.avatarfull = profile.avatarfull;

    const newUser = await this.usersRepository.save(user);

    return newUser;
  }

  async updateUser(profile: GetPlayerSummaries): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        steamId64: profile.steamid,
      },
    });

    user.username = profile.personaname;
    user.profileurl = profile.profileurl;
    user.avatarfull = profile.avatarfull;

    return await this.usersRepository.save(user);
  }

  async updateLastSeen(user: User) {
    return this.usersRepository.save({
      ...user,
      lastLogin: new Date(),
    });
  }

  async getAllFriends(userId: number) {
    const friendsIds = await this.friendsUserService.getAllFriends(userId);

    return this.usersRepository.find({
      where: {
        id: In(friendsIds.map((x) => x.friendId)),
      },
    });
  }
}
