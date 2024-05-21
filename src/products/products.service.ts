import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './models/products.model';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.create(dto);
    return product;
  }

  async getAll(): Promise<Partial<CreateProductDto[]>> {
    const product = await this.productRepository.findAll<Product>();
    return product;
  }

  async getOneById(id: number): Promise<Product> {
    const user = this.productRepository.findOne<Product>({
      rejectOnEmpty: null,
      include: { all: true },
      where: { id },
    });
    return user;
  }

  async update(
    id: number,
    updatedProductDto: Partial<UpdateProductDto>,
  ): Promise<[affectedCount: number, affectedRows: any[]]> {
    return await this.productRepository.update(updatedProductDto, {
      returning: null,
      where: { id },
    });
  }
}
