import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { UsersController } from './modules/users/users.controller';

@Module({
  controllers: [AuthController, UsersController],
})
export class AppModule {}
