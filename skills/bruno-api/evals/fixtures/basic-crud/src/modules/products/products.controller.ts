import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Post()
  @HttpCode(201)
  create(@Body() createDto: Record<string, unknown>) {
    return { id: 'product-1', ...createDto };
  }

  @Get()
  findAll() {
    return [{ id: 'product-1', name: 'Widget', price: 9.99 }];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, name: 'Widget', price: 9.99 };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Record<string, unknown>) {
    return { id, ...updateDto };
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return;
  }
}
