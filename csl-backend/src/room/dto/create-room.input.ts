import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { MaxPlayers } from '../entities/max-players.enum';
import { RoomI } from '../entities/room.interface';

registerEnumType(MaxPlayers, {
  name: 'MaxPlayers',
});

@InputType()
export class CreateRoomInput implements RoomI {
  @Field(() => MaxPlayers, { description: 'Max Players on lobby' })
  maxPlayers: MaxPlayers;
}
