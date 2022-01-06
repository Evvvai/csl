import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { Teams } from 'src/lobby-users/entities/teams.enum';

registerEnumType(Teams, {
  name: 'Teams',
});

@InputType()
export class UsersTeamInput {
  @Field(() => Teams, { description: 'Team in lobby' })
  name: Teams;
}
