import { ObjectType, Field } from '@nestjs/graphql';
import { Lobby } from 'src/lobbies/entities/lobby.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teams } from './teams.enum';

@ObjectType()
@Index('FK_lobby_user_user', ['userId'], {})
@Index('FK_lobby_user_lobby', ['lobbyId'], {})
@Entity({ name: 'lobbies_users' })
export class LobbyUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Teams, default: Teams.CT, nullable: false })
  @Field({ nullable: false })
  team: Teams;

  @Column({ nullable: false })
  @Field({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  @Field({ nullable: false })
  lobbyId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => User, (user) => user.connectedUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Lobby, (lobby) => lobby.lobbiesUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'lobbyId', referencedColumnName: 'id' }])
  lobby: Lobby;
}
