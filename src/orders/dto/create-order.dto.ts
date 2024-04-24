import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
    description: 'Array of order items.',
  })
  @IsNotEmpty()
  @IsNumber()
  orderItems: OrderItemDto[];

  @ApiProperty({ type: Number, description: 'Order total price' })
  @IsNumber()
  totalPrice: number;
}
