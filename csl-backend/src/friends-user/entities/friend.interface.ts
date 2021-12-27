import { RoomI } from 'src/room/entities/room.interface';
import { UserI } from 'src/users/entities/user.interface';

export interface FriendI extends UserI {
  online?: boolean;
  status?: StatusFriend;
}

export interface StatusFriend {
  room?: RoomI;
  action: '. . .' | 'in looby' | 'search game' | 'playing' | 'sleep';
}
