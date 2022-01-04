import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ConnectedLobby } from 'src/connected-lobby/entities/connected-lobby.entity';
import { LobbyUser } from 'src/lobby-users/entities/lobby-user.entity';
import { MaxPlayers } from 'src/room/entities/max-players.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusLobby } from './status-lobby';

@ObjectType()
@Index('FK_lobby_user', ['captainId'], {})
@Entity({ name: 'lobbies' })
export class Lobby {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: false, default: 'Team_CT' })
  @Field({ nullable: false })
  firstTeamName: string;

  @Column({ type: 'varchar', nullable: false, default: 'Team_T' })
  @Field({ nullable: false })
  secondTeamName: string;

  @Column()
  @Field({ nullable: false })
  captainId: number;

  @Column({ type: 'enum', enum: MaxPlayers, default: MaxPlayers.FIVE })
  @Field({ nullable: false })
  maxPlayers: MaxPlayers;

  @Column({
    nullable: false,
    type: 'boolean',
    default: () => 'FALSE',
  })
  @Field({ nullable: false })
  isPublic: boolean;

  @Column({ type: 'enum', enum: StatusLobby, default: StatusLobby.PENDING })
  @Field({ nullable: false })
  status: StatusLobby;

  // Dates info
  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: false })
  createdAt: Date;

  @CreateDateColumn({
    name: 'udaptedAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: false })
  udaptedAt: Date;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToMany(() => ConnectedLobby, (connectedLobby) => connectedLobby.lobby)
  connectedLobbies: ConnectedLobby[];

  @OneToMany(() => LobbyUser, (lobbyUser) => lobbyUser.lobby)
  lobbiesUsers: LobbyUser[];
}
