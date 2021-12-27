import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { CLIENT_HOST } from '@environments';
import { ConnectedRoomService } from 'src/connected-room/connected-room.service';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomI } from 'src/room/entities/room.interface';
import { RoomService } from 'src/room/room.service';
import {
  FriendI,
  StatusFriend,
} from 'src/friends-user/entities/friend.interface';
import { ConnectedUserI } from 'src/connected-user/entities/connected-user.interface';
import { UserI } from 'src/users/entities/user.interface';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';
import { StatusRoom } from 'src/room/entities/status-room';
// import { InjectConnection } from '@nestjs/typeorm';
// import { Connection } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000', CLIENT_HOST],
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    // @InjectConnection('db')
    // private connection: Connection,

    private userService: UsersService,
    private authService: AuthService,
    private connectedUserService: ConnectedUserService,
    private connectedRoomService: ConnectedRoomService,
    private roomService: RoomService,
    private roomsUsersService: RoomsUsersService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAllConnection();
    await this.roomService.deleteAllRooms();
    // await this.connectedRoomService.deleteAllConnection();
    console.log('onModuleInit');
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.userService.findUserBySteamId64(
        decodedToken.steamId64,
      );

      if (!user) return this.disconnect(socket);

      /****************************************************************/

      socket.data.sockets = [];
      socket.data.user = user;

      // Save connection to DB
      const connect = await this.connectedUserService.connectUser({
        socketId: socket.id,
        userId: user.id,
      });

      socket.data.connectedId = connect.id;

      // Check if user have active room
      const activeRoom = await this.roomsUsersService.getRoomByUser(
        socket.data.user,
      );
      if (activeRoom) {
        this.connectedRoomService.create({
          socketId: socket.id,
          connectedUserId: socket.data.connectedId,
          roomId: activeRoom.roomId,
        });
      }

      // Gets all friends
      const allFriends = await this.userService.getAllFriends(user.id);
      const onlineFriends = await this.connectedUserService.getConnects(
        allFriends.map((x) => x.id),
      );
      const friends: FriendI[] = [...allFriends];
      friends.map((x) => {
        onlineFriends.find((y) => y.userId === x.id) !== undefined
          ? (x.online = true)
          : (x.online = false);

        x.status = {} as StatusFriend;
        x.status.action = '. . .';

        return x;
      });
      this.server.to(socket.id).emit('friend/load', friends);
      socket.data.friends = allFriends; // Might come in handy Sorry RAM )0))

      // Find allready exist connection
      const allUserConnection = await this.connectedUserService.findConnect(
        user,
      );

      // Notife friend about user is online
      if (allUserConnection.length === 1) {
        onlineFriends.forEach((user) => {
          return this.server
            .to(user.socketId)
            .emit('friend/online', socket.data.user.id);
        });
      }

      // Sync socket connection
      if (allUserConnection.length > 1) {
        // Save my another sockets
        allUserConnection.forEach((socket) => {
          this.server.to(socket.socketId).emit('sync', allUserConnection);
        });

        // Sync allready exist room
        const isHaveRoom = await this.connectedRoomService.findRoomBySocketIds(
          allUserConnection.map((val) => val.socketId),
        );

        if (isHaveRoom)
          await this.connectedRoomService.create({
            socketId: socket.id,
            connectedUserId: socket.data.connectedId,
            roomId: isHaveRoom.roomId,
          });
      }

      console.log(' > handleConnection', socket.data.user.username);
      return this.server.to(socket.id).emit('connected');
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    const isLastConnect = await this.connectedUserService.findConnect(
      socket.data.user,
    );

    // Notify friend about user is offline
    if (isLastConnect.length === 0) {
      const onlineFriends = await this.connectedUserService.getConnects(
        socket.data.friends.map((x) => x.id),
      );

      onlineFriends.forEach((user) => {
        return this.server
          .to(user.socketId)
          .emit('friend/offline', socket.data.user.id);
      });
    }
    socket.disconnect();
    console.log(' > handleDisconnect', socket.data.user.username);
  }

  // @SubscribeMessage('connection')
  // async newConnection(socket: Socket, room: any) {
  //   console.log('connection');
  // }

  /**
   *
   * Room
   *
   **/

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

    console.log('createRoom');
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
    // console.log('joinRoom');
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

    // console.log('leaveRoom');
  }

  @SubscribeMessage('deleteRoom')
  async onDeleteRoom(socket: Socket, room: RoomI) {
    const connectedRooms = await this.connectedRoomService.findByRoom(room);

    connectedRooms.forEach((connect) => {
      this.server.to(connect.socketId).emit('room/deleted', room);
    });

    this.roomService.deleteRoom(room);

    // console.log('deleteRoom | ', deletedRoom);
  }

  // Socket so slow..
  // @SubscribeMessage('reConnectRoom')
  // async onReConnectRoom(socket: Socket, room: RoomI) {
  //   this.connectedRoomService.create({
  //     socketId: socket.id,
  //     connectedUserId: socket.data.connectedId,
  //     roomId: room.id,
  //   });
  // }

  /**
   *
   * Invites
   *
   **/

  @SubscribeMessage('removeInvite')
  async onRmoveInvite(socket: Socket, payload: { user: UserI; room: RoomI }) {
    const invite = {
      user: socket.data.user,
      room: payload.room,
      sentAt: new Date().getTime(),
      ttl: 10 * 60,
    };

    const connectedUsers = await this.connectedUserService.findConnect(
      payload.user,
    );

    connectedUsers.forEach((user) => {
      this.server
        .to(user.socketId)
        .emit('notification/removeUserInvite', invite);
    });

    // console.log(' ~ removeInvite | ', connectedUsers);
  }

  @SubscribeMessage('sentInvite')
  async onSentInvite(socket: Socket, payload: { user: UserI; room: RoomI }) {
    const invite = {
      user: socket.data.user,
      room: payload.room,
      sentAt: new Date().getTime(),
      ttl: 10 * 60,
    };

    const connectedUsers = await this.connectedUserService.findConnect(
      payload.user,
    );

    connectedUsers.forEach((user) => {
      this.server.to(user.socketId).emit('notification/invite', invite);
    });

    // console.log(' ~ sentInvite | ', connectedUsers);
  }

  @SubscribeMessage('declineInvite')
  async onDeclineInvite(socket: Socket, payload: { user: UserI; room: RoomI }) {
    const invite = {
      user: socket.data.user,
      room: payload.room,
      sentAt: new Date().getTime(),
      ttl: 10 * 60,
    };

    socket.data.sockets.forEach(async (connect) => {
      this.server
        .to(connect.socketId)
        .emit('notification/removeUserInvite', payload);
    });

    const connectedUsers = await this.connectedUserService.findConnect(
      payload.user,
    );

    connectedUsers.forEach((user) => {
      this.server.to(user.socketId).emit('friend/declineInvite', invite);
    });

    // console.log(' ~ declineInvite | ', socket.data.sockets);
  }

  /**
   *
   * Sync
   *
   **/

  @SubscribeMessage('sync')
  async syncSockets(socket: Socket, socketIds: ConnectedUserI[]) {
    console.log('sync');
    socket.data.sockets = socketIds.filter((val) => val.socketId !== socket.id);
  }
}
