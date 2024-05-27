import { Controller, Get, Post, Body, UseGuards, Request, Delete, Param, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req): Promise<Product[]> {
    return this.productsService.findByUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: { name: string, price: number, description: string }): Promise<Product> {
    const { name, price, description } = body;
    return this.productsService.create(req.user, name, price, description);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Request() req, @Param('id') id: number, @Body() body: { name: string, price: number, description: string }): Promise<Product> {
    return this.productsService.update(req.user, id, body.name, body.price, body.description);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    return this.productsService.remove(req.user, id);
  }
}
