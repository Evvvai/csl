import { ConnectedUserI } from 'src/connected-user/entities/connected-user.interface';
import { RoomI } from 'src/room/entities/room.interface';
import { UserI } from 'src/users/entities/user.interface';

export interface ConnectedRoomI {
  id?: number;
  socketId: string;
  connectedUserId?: number;
  // roomId?: number;
  connectedUser?: ConnectedUserI;
  room?: RoomI;
}
