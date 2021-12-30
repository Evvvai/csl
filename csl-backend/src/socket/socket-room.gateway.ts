import {
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

@WebSocketGateway({
  cors: {
    origin: [
      'https://www.surfcombat.xyz',
      'https://apishka.xyz:8080',
      'https://apishka.xyz:8080/socket.io',
      'http://localhost:8080',
      'http://localhost:3000',
      CLIENT_HOST,
      SERVER_HOST + ':' + PORT,
    ],
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
  ) {}

  async onModuleInit() {
    await this.roomService.deleteAllRooms();
    Logger.debug(' > onModuleInitRoom');
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const newRoom = await this.connectedRoomService.create({
      socketId: socket.id,
      connectedUserId: socket.data.connectedId,
      roomId: room.id,
    });

    socket.data.sockets.forEach(async (val) => {
      await this.connectedRoomService.create({
        socketId: val.socketId,
        connectedUserId: val.id,
        roomId: newRoom.roomId,
      });

      this.server.to(val.socketId).emit('sync/roomCreated', room);
    });

    Logger.debug(' > createRoom');
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    const newRoom = await this.roomService.getRoomById(room.id);
    const users = await this.roomsUsersService.getUsersByRoom(room);

    if (room.maxPlayers === users.length) {
      this.server.to(socket.id).emit('room/joinError');
    } else {
      this.roomService.updateStatus(room.id, StatusRoom.PENDING);
      const connected = await this.connectedRoomService.getAllConnectionByRoom(
        newRoom,
      );
      newRoom.users = users;
      newRoom.users.push(socket.data.user);
      connected.forEach(async (connect) => {
        this.server
          .to(connect.socketId)
          .emit('room/userJoin', socket.data.user);
      });

      this.roomsUsersService.addUserToRoom(room, socket.data.user);
      this.server.to(socket.id).emit('room/joinRoom', newRoom);
      this.connectedRoomService.create({
        socketId: socket.id,
        connectedUserId: socket.data.connectedId,
        roomId: room.id,
      });
      socket.data.sockets.forEach(async (connect) => {
        this.server.to(connect.socketId).emit('sync/joinRoom', newRoom);
        this.connectedRoomService.create({
          socketId: connect.socketId,
          connectedUserId: connect.id,
          roomId: room.id,
        });
      });
    }

    // Got message chat and emit
    // await this.server.to(socket.id).emit('messages', messages);
    // Logger.debug(' > joinRoom');
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket, room: RoomI) {
    this.connectedRoomService.deleteBySocketId(socket.id);
    this.connectedRoomService.deleteBySocketIds(
      [...socket.data.sockets].map((x) => x.socketId),
    );
    this.roomService.updateStatus(room.id, StatusRoom.PENDING);
    this.roomsUsersService.removeUser(socket.data.user);

    const connected = await this.connectedRoomService.getAllConnectionByRoom(
      room,
    );
    connected.forEach(async (connect) => {
      this.server.to(connect.socketId).emit('room/userLeave', socket.data.user);
    });
    socket.data.sockets.forEach(async (connect) => {
      this.server.to(connect.socketId).emit('sync/leaveRoom');
    });

    // Logger.debug(' > leaveRoom');
  }

  @SubscribeMessage('deleteRoom')
  async onDeleteRoom(socket: Socket, room: RoomI) {
    const connectedRooms = await this.connectedRoomService.findByRoom(room);

    connectedRooms.forEach((connect) => {
      this.server.to(connect.socketId).emit('room/deleted', room);
    });

    this.roomService.deleteRoom(room);

    // Logger.debug(' > deleteRoom', deletedRoom);
  }
}
