import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ConnectedRoom } from 'src/connected-room/entities/connected-room.entity';
import { RoomsUsers } from 'src/rooms-users/entities/rooms-users.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MaxPlayers } from './max-players.enum';

@ObjectType()
@Index('FK_room_user', ['captainId'], {})
@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar' })
  @Field({ nullable: false })
  name: string;

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

  @Column({
    nullable: false,
    type: 'boolean',
    default: () => 'FALSE',
  })
  @Field({ nullable: false })
  isSearch: boolean;

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

  @OneToMany(() => ConnectedRoom, (connectedRoom) => connectedRoom.room)
  connectedRooms: ConnectedRoom[];

  @OneToMany(() => RoomsUsers, (roomsUsers) => roomsUsers.room)
  roomsUsers: RoomsUsers[];
}
