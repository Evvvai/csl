import { ConnectedUser } from 'src/connected-user/entities/connected-user.entity';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Index('FK_connected_room_connected_user', ['connectedUserId'], {})
@Index('FK_connected_room_room', ['roomId'], {})
export class ConnectedRoom {
  @PrimaryColumn({ nullable: false })
  connectedUserId: number;

  @PrimaryColumn({ nullable: false })
  socketId: string;

  @Column({ nullable: false })
  roomId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(
    () => ConnectedUser,
    (connectedUser) => connectedUser.connectedRoom,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn()
  connectedUser: ConnectedUser;

  @ManyToOne(() => Room, (room) => room.connectedRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn()
  room: Room;
}
