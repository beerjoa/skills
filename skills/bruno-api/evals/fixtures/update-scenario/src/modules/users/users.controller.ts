import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [{ id: 'user-1', email: 'user@example.com' }];
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: { email: string; name: string }) {
    return { id: 'user-2', ...dto };
  }

  // CHANGED: path changed from /:userId to /:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, email: 'user@example.com' };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { name?: string }) {
    return { id, ...dto };
  }

  // NEW endpoint:
  @Get('search')
  search(@Param('q') q: string) {
    return [{ id: 'user-1', email: 'user@example.com' }];
  }

  // REMOVED: delete endpoint no longer exists
}
