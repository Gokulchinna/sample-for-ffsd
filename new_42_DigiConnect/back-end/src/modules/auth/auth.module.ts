import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MockDbService } from '../../database/mock-db.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MockDbService],
  exports: [AuthService],
})
export class AuthModule {}
