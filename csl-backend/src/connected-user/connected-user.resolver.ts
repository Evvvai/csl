import { Resolver } from '@nestjs/graphql';
import { ConnectedUserService } from './connected-user.service';
import { ConnectedUser } from './entities/connected-user.entity';

@Resolver(() => ConnectedUser)
export class ConnectedUserResolver {
  constructor(private readonly connectedUserService: ConnectedUserService) {}
}
