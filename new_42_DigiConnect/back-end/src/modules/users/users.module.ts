import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MockDbService],
  exports: [UsersService],
})
export class UsersModule {}
