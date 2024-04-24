import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/common/pipes/validation.pipe';
import { Product } from './models/products.model';
import { ProductsService } from './products.service';
import { Public } from 'src/common/decorators';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({ summary: 'Add product' })
  @ApiResponse({ status: 201, type: [Product] })
  @UsePipes(CustomValidationPipe)
  @Post()
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [Product] })
  @UsePipes(CustomValidationPipe)
  @Get()
  getAll(): Promise<Product[]> {
    return this.productsService.getAll();
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, type: [Product] })
  @Public()
  @Get('/:id')
  getOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.getOneById(id);
  }

  @ApiOperation({ summary: 'Update product by id' })
  @ApiResponse({ status: 201, type: [Product] })
  @Public()
  @UsePipes(CustomValidationPipe)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatedProductDto: Partial<UpdateProductDto>,
  ) {
    return this.productsService.update(id, updatedProductDto);
  }
}
