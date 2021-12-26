import { UserI } from 'src/users/entities/user.interface';

export interface ConnectedUserI {
  id?: number;
  socketId: string;
  userId: number;
  // user: UserI;
}
