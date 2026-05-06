import { Module } from '@nestjs/common';
import { ProductsController } from './modules/products/products.controller';

@Module({
  controllers: [ProductsController],
})
export class AppModule {}
