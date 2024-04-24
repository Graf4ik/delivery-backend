import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tokens } from './types/tokens.type';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { User } from '../users/models/users.model';
import { RefreshTokenGuard } from '../common/guards';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user' })
  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  registration(@Body() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Login user session' })
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Logout user session' })
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
  ): Promise<[affectedCount: number, affectedRows: User[]]> {
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'Set new refresh token' })
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUser() userDto: User): Promise<Tokens> {
    return this.authService.refreshTokens(userDto);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@GetCurrentUser() userDto: User): Promise<User> {
    return this.authService.getUserProfile(userDto);
  }
}
