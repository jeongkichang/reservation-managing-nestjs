import { Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['user'] });
  }

  async findByUser(user: User): Promise<Product[]> {
    return this.productRepository.find({ where: { user }, relations: ['user'] });
  }
}
