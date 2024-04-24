import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from 'src/orders/models/orders.model';
import { Product } from 'src/products/models/products.model';

interface OrderItemAttrs {
  product: Product;
  quantity: number;
  name: string;
  orderId: number;
  productId: number;
}

@Table({ tableName: 'order-items', createdAt: false, updatedAt: false })
export class OrderItem extends Model<OrderItem, OrderItemAttrs> {
  @ApiProperty({ example: '1', description: 'Id' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'Quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  quantity: number;

  @ApiProperty({ example: 'Chicken Burger', description: 'Product name' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @ApiProperty({ example: '2', description: 'Product id' })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  productId: number;

  @HasMany(() => Product)
  product: Product;

  @ApiProperty({ example: '3', description: 'Order id' })
  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;
}
