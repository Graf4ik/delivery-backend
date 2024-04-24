import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ type: String, description: 'Id of the product.' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ type: Number, description: 'Quantity of the product.' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
