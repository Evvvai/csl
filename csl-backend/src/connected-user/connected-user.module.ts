import { Module } from '@nestjs/common';
import { ConnectedUserService } from './connected-user.service';
import { ConnectedUserResolver } from './connected-user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUser } from './entities/connected-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedUser])],
  providers: [ConnectedUserResolver, ConnectedUserService],
  exports: [ConnectedUserService],
})
export class ConnectedUserModule {}
