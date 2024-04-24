import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/users.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto): Promise<Tokens> {
    const user = await this.validateUser(userDto);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshTokenHash(user, tokens.refreshToken);
    return tokens;
  }

  async registration(userDto: CreateUserDto): Promise<Tokens> {
    const userExists = await this.usersService.getOneByEmail(userDto.email);

    if (userExists) {
      throw new BadRequestException({ type: 'User already exists' });
    }

    const hashPassword = await this.hashData(userDto.password);
    const newUser = await this.usersService.create({
      ...userDto,
      password: hashPassword,
    });
    const tokens = await this.generateTokens(newUser);
    await this.updateRefreshTokenHash(newUser, tokens.refreshToken);
    return tokens;
  }

  async logout(
    userId: number,
  ): Promise<[affectedCount: number, affectedRows: User[]]> {
    return await this.usersService.update(userId, { refreshToken: null });
  }

  async getUserProfile(userDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.getOneByEmail(userDto.email);
    return user;
  }

  async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.getOneByEmail(userDto.email);
    const passwordMatches = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordMatches) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Incorrect email or password',
    });
  }

  async generateTokens(user: User): Promise<Tokens> {
    const payload = { id: user.id, email: user.email, roles: user.roles };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '2h',
      }),
      this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '20d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userDto: User): Promise<Tokens> {
    const user = await this.usersService.getOneById(userDto.id);
    if (!user) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = bcrypt.compare(
      userDto.refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(userDto);
    await this.updateRefreshTokenHash(userDto, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshTokenHash(user: User, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }
}
