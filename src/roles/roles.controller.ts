import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from './roles.model';
import { CustomValidationPipe } from '../common/pipes/validation.pipe';
import { Public } from '../common/decorators';

@ApiTags('User roles')
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: 'Create role' })
  @UsePipes(CustomValidationPipe)
  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({ summary: 'Get role by value' })
  @Public()
  @Get('/:value')
  getByValue(@Param('value') value: string): Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }
}
