import { Resolver } from '@nestjs/graphql';
import { ConnectedLobbyService } from './connected-lobby.service';
import { ConnectedLobby } from './entities/connected-lobby.entity';

@Resolver(() => ConnectedLobby)
export class ConnectedLobbyResolver {
  constructor(private readonly connectedLobbyService: ConnectedLobbyService) {}
}
