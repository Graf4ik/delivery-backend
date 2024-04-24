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
import { User } from 'src/users/models/users.model';
import { OrderItem } from './order-item.model';

interface OrderAttrs {
  totalPrice: number;
  orderCode: string;
  userId: number;
  orderItems: OrderItem[];
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, OrderAttrs> {
  @ApiProperty({ example: '1', description: 'Id' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Order_ASD', description: 'OrderCode' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderCode: string;

  @ApiProperty({ example: '100', description: 'Totalprice' })
  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  totalPrice: number;

  @ApiProperty({ example: '2', description: 'User id' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ example: '№234', description: 'Order items' })
  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}
