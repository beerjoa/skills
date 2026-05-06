import { Controller, Get, Patch, Delete, Param, Body, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [{ id: 'user-1', email: 'user@example.com', name: 'Alice' }];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, email: 'user@example.com', name: 'Alice' };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: { name?: string }) {
    return { id, ...dto };
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return;
  }
}
