import { ConnectedRoom } from 'src/connected-room/entities/connected-room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index('FK_connected_user_user', ['userId'], {})
export class ConnectedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  userId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => User, (user) => user.connectedUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => ConnectedRoom,
    (connectedRoom) => connectedRoom.connectedUser,
  )
  connectedRoom: ConnectedRoom[];
}
