import { Role } from 'src/users/entities/role.enum';

export class JwtDto {
  steamId64: string;
  role: Role;
}
