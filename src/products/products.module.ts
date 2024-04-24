import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './models/products.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItem } from 'src/orders/models/order-item.model';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [SequelizeModule.forFeature([Product, OrderItem])],
  exports: [ProductsService],
})
export class ProductsModule {}
