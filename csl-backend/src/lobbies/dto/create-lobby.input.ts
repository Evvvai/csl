import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { MaxPlayers } from 'src/room/entities/max-players.enum';
import { LobbyI } from '../entities/lobby.interface';

registerEnumType(MaxPlayers, {
  name: 'MaxPlayers',
});

@InputType()
export class CreateLobbyInput {
  @Field(() => MaxPlayers, { description: 'Max Players on lobby' })
  maxPlayers: MaxPlayers;
}
