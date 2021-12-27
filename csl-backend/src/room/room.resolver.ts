import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService,

    private readonly roomsUsersService: RoomsUsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Room)
  createRoom(
    @CtxUser() user: User,
    @Args('input') createRoomInput: CreateRoomInput,
  ) {
    return this.roomService.create(user, createRoomInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removeRoom(@CtxUser() user: User) {
    return this.roomService.remove(user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Room)
  activeRoom(@CtxUser() user: User) {
    return this.roomService.getRoomsForUser(user);
  }

  @Query(() => Room)
  room(@Args('id') id: number) {
    return this.roomService.getRoomById(id);
  }

  // Resolve
  @ResolveField((returns) => [User], { name: 'users' })
  users(@Parent() room: Room) {
    return this.roomsUsersService.getUsersByRoom(room);
  }
}
