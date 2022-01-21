/**
 *
 *
 * Socket functions Postgers is an alternative it may not be used
 *
 *
 */

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { CLIENT_HOST, PORT, SERVER_HOST } from '@environments';
import { ConnectedRoomService } from 'src/connected-room/connected-room.service';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomI } from 'src/room/entities/room.interface';
import { RoomService } from 'src/room/room.service';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';
import { StatusRoom } from 'src/room/entities/status-room';
import { RediskaService } from 'src/shared/services/rediska.service';

@WebSocketGateway({
  cors: {
    origin: ['*', CLIENT_HOST, SERVER_HOST + ':' + PORT],
    credentials: true,
  },
})
export class SocketRoomGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private connectedUserService: ConnectedUserService,
    private connectedRoomService: ConnectedRoomService,
    private roomService: RoomService,
    private roomsUsersService: RoomsUsersService,
    private rediskaService: RediskaService,
  ) {}

  async onModuleInit() {
    await this.connectedRoomService.deleteAllConnection();
    await this.roomService.deleteAllRooms();
    Logger.debug(' > onModuleInitRoom');
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: RoomI,
  ) {
    socket.data.sockets.forEach(async (socketSync) => {
      // *Postgres
      // this.connectedRoomService.create({
      //   socketId: socketSync.socketId,
      //   connectedUserId: socketSync.id,
      //   roomId: room.id,
      // });
      // *Redis
      this.rediskaService.addToRoom(
        room.id,
        this.server.sockets.sockets.get(socketSync).data.user.id,
        socketSync,
      );

      this.server.sockets.sockets.get(socketSync).join('room' + room.id);
    });

    this.server.to('uid' + socket.data.user.id).emit('sync/roomCreated', room);

    Logger.debug(' > createRoom');
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: RoomI,
  ) {
    const newRoom = await this.roomService.getRoomById(room.id);
    const users = await this.roomsUsersService.getUsersByRoom(room);

    if (room.maxPlayers === users.length) {
      this.server.to(socket.id).emit('room/joinError');
    } else {
      this.roomService.updateStatus(room.id, StatusRoom.PENDING);
      this.roomsUsersService.addUserToRoom(room, socket.data.user);
      newRoom.users = users;
      newRoom.users.push(socket.data.user);

      this.server
        .to('room' + newRoom.id)
        .emit('room/userJoin', socket.data.user);
      this.server.to(socket.id).emit('room/joinRoom', newRoom);

      socket.data.sockets.forEach(async (socketSync) => {
        // *Postgres
        // this.connectedRoomService.create({
        //   socketId: socketSync.socketId,
        //   connectedUserId: socketSync.id,
        //   roomId: room.id,
        // });
        // *Redis
        this.rediskaService.addToRoom(
          room.id,
          this.server.sockets.sockets.get(socketSync).data.user.id,
          socketSync,
        );
      });

      this.server
        .to('uid' + socket.data.user.id)
        .emit('sync/joinRoom', newRoom);
    }

    // Got message chat and emit
    // await this.server.to(socket.id).emit('messages', messages);
    // Logger.debug(' > joinRoom');
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: RoomI,
  ) {
    // *Postgres
    // this.connectedRoomService.deleteBySocketId(socket.id);
    // this.connectedRoomService.deleteBySocketIds(
    //   [...socket.data.sockets].map((x) => x.socketId),
    // );
    // *Redis
    this.rediskaService.removeFromRoom(room.id, socket.data.user.id);

    this.roomService.updateStatus(room.id, StatusRoom.PENDING);
    this.roomsUsersService.removeUser(socket.data.user);

    this.server.to('room' + room.id).emit('room/userLeave', socket.data.user);
    this.server.to('uid' + socket.data.user.id).emit('sync/leaveRoom');

    Logger.debug(' > leaveRoom');
  }

  @SubscribeMessage('deleteRoom')
  async onDeleteRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: RoomI,
  ) {
    this.server.to('room' + room.id).emit('room/deleted', room);

    // *Postgres
    // const connectedRooms = await this.connectedRoomService.findByRoom(room);
    // connectedRooms.forEach(async (socketSync) => {
    //   this.server.sockets.sockets
    //     .get(socketSync.socketId)
    //     .leave('room' + room.id);
    // });
    // *Redis
    const socketIds = await this.rediskaService.getAllByRoom(room.id);
    Object.keys(socketIds).forEach(async (socketId) => {
      this.server.sockets.sockets.get(socketId).leave('room' + room.id);
    });
    this.rediskaService.removeRoom(room.id);

    Logger.debug(' > deleteRoom ' + socket.data.user.username);
  }
}
