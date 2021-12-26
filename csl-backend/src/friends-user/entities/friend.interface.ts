import { UserI } from 'src/users/entities/user.interface';

export interface FriendI extends UserI {
  status?: boolean;
}
