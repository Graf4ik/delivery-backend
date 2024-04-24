import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from './models/users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from '../common/pipes/validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles-auth.decorator';
import { Role } from '../roles/types/roles.type';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public } from '../common/decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Add user' })
  @ApiResponse({ status: 201, type: [User] })
  @UsePipes(CustomValidationPipe)
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @ApiOperation({ summary: 'Set role' })
  @ApiResponse({ status: 201 })
  @Post('/role')
  addRole(@Body() dto: AddRoleDto): Promise<AddRoleDto> {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Get user by email' })
  @Public()
  @Get('/:email')
  getOne(@Param('email', ParseUUIDPipe) email: string): Promise<User> {
    return this.usersService.getOneByEmail(email);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 201, type: [User] })
  @Public()
  @UsePipes(CustomValidationPipe)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatedUserDto: UpdateUserDto) {
    return this.usersService.update(id, updatedUserDto);
  }
}
