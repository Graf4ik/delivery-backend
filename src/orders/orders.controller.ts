import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './models/orders.model';
import { Roles } from 'src/common/decorators/roles-auth.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/roles/types/roles.type';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { User } from 'src/users/models/users.model';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 201, type: [Order] })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Post()
  async createOrder(
    @GetCurrentUser() user: User,
    @Body() dto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.createOrder(user, dto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Get()
  async getOrders(): Promise<Order[]> {
    return await this.ordersService.getOrders();
  }

  @ApiOperation({ summary: 'Get orders by user' })
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Get('my')
  async getOrdersByUser(@GetCurrentUserId() userId: number): Promise<Order[]> {
    return await this.ordersService.getOrdersByUser(userId);
  }
}
