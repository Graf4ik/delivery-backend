import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @ApiProperty({ example: 'Ivan Ivanov', description: 'FullName' })
  readonly fullName: string;

  @ApiProperty({ example: 'eysd56d...', description: 'RefreshToken' })
  readonly refreshToken: string;
}
