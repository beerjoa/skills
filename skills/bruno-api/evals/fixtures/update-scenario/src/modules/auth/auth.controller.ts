import { Controller, Post, Get, HttpCode, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('signup')
  @HttpCode(201)
  signup(@Body() dto: { email: string; password: string }) {
    return { id: 'user-1', email: dto.email, accessToken: 'jwt-token' };
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: { email: string; password: string }) {
    return { accessToken: 'jwt-token', refreshToken: 'refresh-token' };
  }

  // NEW endpoint:
  @Post('logout')
  @HttpCode(200)
  logout() {
    return { message: 'Logged out' };
  }
}
