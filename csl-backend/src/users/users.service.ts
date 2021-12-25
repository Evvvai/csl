import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPlayerSummaries } from 'src/auth/steamapi-auth.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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

  createUser(createUserInput: CreateUserInput) {
    const newUser = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(newUser);
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

    return await this.usersRepository.save(user);
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
}
