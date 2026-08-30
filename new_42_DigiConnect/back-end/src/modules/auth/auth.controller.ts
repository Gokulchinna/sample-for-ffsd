import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserProfile } from '../../database/collections/users.collection';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { loginId: string; password?: string }) {
    return this.authService.login(body.loginId, body.password);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }
}
