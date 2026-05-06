import { Controller, Get, Post, Param, Body, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: { productId: string; quantity: number }) {
    return { id: 'order-1', ...dto, status: 'created' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return [{ id: 'order-1', productId: 'product-1', quantity: 2, status: 'created' }];
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return { id, productId: 'product-1', quantity: 2, status: 'created' };
  }
}
