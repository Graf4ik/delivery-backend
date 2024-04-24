import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'burgers', description: 'Category' })
  @IsString({ message: 'Must be a string' })
  readonly category: string;

  @ApiProperty({ example: 'Chicken Burger', description: 'Name' })
  @IsString({ message: 'Must be a string' })
  readonly name: string;

  @ApiProperty({
    example: 'Crispy seasoned chicken breast...',
    description: 'Description',
  })
  @IsString({ message: 'Must be a string' })
  readonly description: string;

  @ApiProperty({
    example: '/assets/images/burgers/burger.png',
    description: 'ImageUrl',
  })
  @IsString({ message: 'Must be a string' })
  readonly imageUrl: string;

  @ApiProperty({
    example: 's, m, l',
    description: 'Size',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  readonly size: string[];

  @ApiProperty({ example: '10', description: 'Price' })
  @IsNumber()
  @Min(0)
  readonly price: number;
}
