import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/orders.model';
import { User } from 'src/users/models/users.model';
import { ProductsService } from 'src/products/products.service';
import { OrderItemDto } from './dto/order-item.dto';
import { OrderItem } from './models/order-item.model';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private orderItems: OrderItem[] = [];

  constructor(
    @InjectModel(Order) private ordersRepository: typeof Order,
    @InjectModel(OrderItem)
    private ordersItemsRepository: typeof OrderItem,
    private productsService: ProductsService,
  ) {}

  async createOrder(user: User, dto: CreateOrderDto): Promise<Order> {
    try {
      const order = await this.ordersRepository.create({
        userId: user.id,
        totalPrice: dto.totalPrice,
        orderCode: `${this.generateOrderCode()}`,
        orderItems: this.orderItems,
      });

      await this.createOrderItems(order.id, dto['orderItems']);
      return order;
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to create order', HttpStatus.FORBIDDEN);
    }
  }

  async createOrderItems(orderId: number, data: OrderItemDto[]) {
    data.map(async (item: OrderItemDto) => {
      const product = await this.productsService.getOneById(
        Number(item.productId),
      );
      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }
      const orderItem = await this.ordersItemsRepository.create({
        orderId,
        productId: Number(item.productId),
        name: product.name,
        quantity: item.quantity ? item.quantity : 1,
      });
      this.orderItems.push(orderItem);
    });
  }

  async getOrders(): Promise<Order[]> {
    const orders = this.ordersRepository.findAll<Order>({
      include: { all: true },
    });
    return orders;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    const orders = this.ordersRepository.findAll({
      include: { all: true },
      where: { userId },
    });
    return orders;
  }

  async updateOrder(
    id: number,
    updateOrderDto: any,
  ): Promise<[affectedCount: number, affectedRows: Order[]]> {
    return await this.ordersRepository.update(updateOrderDto, {
      returning: null,
      where: { id },
    });
  }

  generateOrderCode(): string {
    let result = '';
    const characters = 'A1B2С4D5E6F7G8H9IJKLMNOPQRSTUVWXYZ';
    let counter = 0;
    while (counter < 7) {
      result += characters.charAt(Math.floor(Math.random() * 30));
      counter++;
    }
    return result;
  }
}
