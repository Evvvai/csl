import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Index('FK_rooms_user_user', ['userId'], {})
@Index('FK_rooms_user_room', ['roomId'], {})
@Entity({ name: 'rooms_users' })
export class RoomsUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field({ nullable: false })
  userId: number;

  @Column()
  @Field({ nullable: false })
  roomId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => User, (user) => user.connectedUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Room, (room) => room.roomsUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'roomId', referencedColumnName: 'id' }])
  room: Room;
}
