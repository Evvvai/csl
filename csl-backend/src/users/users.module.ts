import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConnectedUser } from 'src/connected-user/entities/connected-user.entity';
import { FriendsUserModule } from 'src/friends-user/friends-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, ConnectedUser]), FriendsUserModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
