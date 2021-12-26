import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Index('FK_friend_user_user', ['userId'], {})
@Index('FK_friend_user_friend', ['friendId'], {})
@Entity({ name: 'friends_user' })
export class FriendsUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field({ nullable: false })
  userId: number;

  @Column()
  @Field({ nullable: false })
  friendId: number;

  @CreateDateColumn({
    name: 'since',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: false })
  since: Date;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  @ManyToOne(() => User, (user) => user.friend1, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user1: User;

  @ManyToOne(() => User, (user) => user.friend2, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'friendId', referencedColumnName: 'id' }])
  user2: User;
}
