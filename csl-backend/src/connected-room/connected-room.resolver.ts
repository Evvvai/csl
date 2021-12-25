import { Resolver } from '@nestjs/graphql';
import { ConnectedRoomService } from './connected-room.service';
import { ConnectedRoom } from './entities/connected-room.entity';

@Resolver(() => ConnectedRoom)
export class ConnectedRoomResolver {
  constructor(private readonly connectedRoomService: ConnectedRoomService) {}
}
