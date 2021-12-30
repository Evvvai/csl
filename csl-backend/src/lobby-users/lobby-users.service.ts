import { Injectable } from '@nestjs/common';

@Injectable()
export class LobbyUsersService {
  findAll() {
    return `This action returns all lobbyUsers`;
  }
}
