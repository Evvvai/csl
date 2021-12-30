import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Lobby } from 'src/lobbies/entities/lobby.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Index('FK_connected_lobby_lobby', ['lobbyId'], {})
@Entity({ name: 'connected_lobby' })
export class ConnectedLobby {
  @PrimaryColumn({ nullable: false })
  connectedUserId: number;

  @Column({ nullable: false })
  lobbyId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => Lobby, (lobby) => lobby.connectedLobbies, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn()
  lobby: Lobby;
}
