import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ConnectedRoom } from 'src/connected-room/entities/connected-room.entity';
import { ConnectedUser } from 'src/connected-user/entities/connected-user.entity';
import { RoomsUsers } from 'src/rooms-users/entities/rooms-users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.enum';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  // Relations
  User(arg0: string, User: any) {
    ///////////////
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field({ nullable: false })
  steamId64: string;

  @Column({ type: 'varchar' })
  @Field({ nullable: false })
  username: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  profileurl: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  avatarfull: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  avatarCustom: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  dashboard: string;

  @CreateDateColumn({
    name: 'dateReg',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: false })
  dateReg: Date;

  @CreateDateColumn({
    name: 'lastLogin',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: false })
  lastLogin: Date;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field({ nullable: false })
  role: Role;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @OneToMany(() => ConnectedUser, (connectedUser) => connectedUser.user)
  connectedUsers: ConnectedUser[];

  // @OneToMany(() => ConnectedRoom, (connectedRoom) => connectedRoom.user)
  // connectedRooms: ConnectedRoom[];

  @OneToMany(() => RoomsUsers, (roomsUsers) => roomsUsers.user)
  roomsUsers: RoomsUsers[];
}
