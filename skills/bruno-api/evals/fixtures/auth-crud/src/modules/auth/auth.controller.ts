import { Controller, Post, Get, HttpCode, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @Post('register')
  @HttpCode(201)
  register(@Body() dto: { email: string; password: string }) {
    return { id: 'user-1', email: dto.email, accessToken: 'jwt-token-here', refreshToken: 'refresh-token-here' };
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: { email: string; password: string }) {
    return { accessToken: 'jwt-token-here', refreshToken: 'refresh-token-here' };
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: { refreshToken: string }) {
    return { accessToken: 'new-jwt-token', refreshToken: 'new-refresh-token' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile() {
    return { id: 'user-1', email: 'user@example.com' };
  }
}
