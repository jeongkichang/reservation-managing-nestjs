import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(user: User, name: string, price: number, description: string): Promise<Product> {
    const product = this.productRepository.create({
        name,
        price,
        description,
        userId: user.id,
    });
 
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async update(user: User, id: number, name: string, price: number, description: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, user } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.name = name;
    product.price = price;
    product.description = description;
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['user'] });
  }

  async findByUser(user: User): Promise<Product[]> {
    return this.productRepository.find({ where: { user }, relations: ['user'] });
  }

  async findOne(user: User, id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, user } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(user: User, id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id, user } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(product);
  }
}
