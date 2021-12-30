import { Injectable } from '@nestjs/common';

@Injectable()
export class LobbiesService {
  findAll() {
    return `This action returns all lobbies`;
  }
}
