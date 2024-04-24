import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './models/orders.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { OrderItem } from './models/order-item.model';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [
    SequelizeModule.forFeature([Order, OrderItem, User]),
    ProductsModule,
    forwardRef(() => AuthModule),
  ],
})
export class OrdersModule {}
