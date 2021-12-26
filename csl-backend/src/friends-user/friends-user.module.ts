import { Module } from '@nestjs/common';
import { FriendsUserService } from './friends-user.service';
import { FriendsUserResolver } from './friends-user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsUser } from './entities/friends-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendsUser])],
  providers: [FriendsUserResolver, FriendsUserService],
  exports: [FriendsUserService],
})
export class FriendsUserModule {}
