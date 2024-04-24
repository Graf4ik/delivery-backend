import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './models/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/types/roles.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue(Role.USER);
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAll(): Promise<User[]> {
    const users = this.userRepository.findAll<User>({ include: { all: true } });
    return users;
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = this.userRepository.findOne<User>({
      rejectOnEmpty: null,
      include: { all: true },
      where: { email },
    });
    return user;
  }

  async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException(
      'Пользователь или роль не найдена',
      HttpStatus.NOT_FOUND,
    );
  }

  async getOneById(id: number): Promise<User | null> {
    const user = this.userRepository.findOne<User>({
      rejectOnEmpty: null,
      where: { id },
    });
    return user;
  }

  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<[affectedCount: number, affectedRows: User[]]> {
    return await this.userRepository.update(updateUserDto, {
      returning: null,
      where: { id },
    });
  }
}
