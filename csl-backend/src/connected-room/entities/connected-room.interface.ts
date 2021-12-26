import { ConnectedUserI } from 'src/connected-user/entities/connected-user.interface';
import { RoomI } from 'src/room/entities/room.interface';
import { UserI } from 'src/users/entities/user.interface';

export interface ConnectedRoomI {
  connectedUserId: number;
  socketId: string;
  roomId: number;
  // connectedUser?: ConnectedUserI;
  // room?: RoomI;
}
