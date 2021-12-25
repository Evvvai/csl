import { Role } from './role.enum';

export interface UserI {
  id: number;
  steamId64: string;
  username: string;
  profileurl: string;
  avatarfull: string;
  avatarCustom: string;
  dashboard: string;
  dateReg: Date;
  lastLogin: Date;
  role: Role;
}
