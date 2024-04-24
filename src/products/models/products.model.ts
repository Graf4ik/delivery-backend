import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderItem } from 'src/orders/models/order-item.model';

interface ProductAttrs {
  category: string;
  title: string;
  description: string;
  price: number;
  size: string[];
  imageUrl: string;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductAttrs> {
  @ApiProperty({ example: '1', description: 'Id' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'burgers', description: 'Category' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category: string;

  @ApiProperty({ example: 'Chicken Burger', description: 'Product name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'Crispy seasoned chicken breast...',
    description: 'Subtitle',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  size: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  price: number;

  @ApiProperty({ example: '2', description: 'OrderItem id' })
  @ForeignKey(() => OrderItem)
  @Column({ type: DataType.INTEGER })
  orderItemId: number;

  @BelongsTo(() => OrderItem)
  orderItem: OrderItem;
}
