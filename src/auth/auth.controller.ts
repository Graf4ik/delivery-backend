import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Tokens } from './types/tokens.type';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { User } from '../users/users.model';
import { RefreshTokenGuard } from '../common/guards';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  registration(@Body() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.registration(userDto);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.login(userDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
  ): Promise<[affectedCount: number, affectedRows: User[]]> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUser() userDto: User): Promise<Tokens> {
    return this.authService.refreshTokens(userDto);
  }
}
