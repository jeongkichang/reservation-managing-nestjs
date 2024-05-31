import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const user = { id: 1 } as User;
      const name = 'Test Product';
      const price = 100;
      const description = 'Test Description';
      const product = { id: 1, name, price, description, userId: user.id } as Product;

      jest.spyOn(repository, 'create').mockReturnValue(product);
      jest.spyOn(repository, 'save').mockResolvedValue(product);

      const result = await service.create(user, name, price, description);

      expect(result).toEqual(product);
      expect(repository.create).toHaveBeenCalledWith({ name, price, description, userId: user.id });
      expect(repository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const user = { id: 1 } as User;
      const id = 1;
      const name = 'Updated Product';
      const price = 150;
      const description = 'Updated Description';
      const product = { id, name, price, description, userId: user.id } as Product;

      jest.spyOn(repository, 'findOne').mockResolvedValue(product);
      jest.spyOn(repository, 'save').mockResolvedValue(product);

      const result = await service.update(user, id, name, price, description);

      expect(result).toEqual(product);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id, user } });
      expect(repository.save).toHaveBeenCalledWith(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      const user = { id: 1 } as User;
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(user, id, 'name', 100, 'desc')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        { id: 1, name: 'Product 1', price: 100, description: 'Desc 1' } as Product,
        { id: 2, name: 'Product 2', price: 200, description: 'Desc 2' } as Product,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['user'] });
    });
  });

  describe('findByUser', () => {
    it('should return an array of products for a user', async () => {
      const user = { id: 1 } as User;
      const products = [
        { id: 1, name: 'Product 1', price: 100, description: 'Desc 1', user } as Product,
        { id: 2, name: 'Product 2', price: 200, description: 'Desc 2', user } as Product,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(products);

      const result = await service.findByUser(user);

      expect(result).toEqual(products);
      expect(repository.find).toHaveBeenCalledWith({ where: { user }, relations: ['user'] });
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const user = { id: 1 } as User;
      const id = 1;
      const product = { id, name: 'Product 1', price: 100, description: 'Desc 1', user } as Product;

      jest.spyOn(repository, 'findOne').mockResolvedValue(product);

      const result = await service.findOne(user, id);

      expect(result).toEqual(product);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id, user } });
    });

    it('should throw NotFoundException if product not found', async () => {
      const user = { id: 1 } as User;
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(user, id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const user = { id: 1 } as User;
      const id = 1;
      const product = { id, name: 'Product 1', price: 100, description: 'Desc 1', user } as Product;

      jest.spyOn(repository, 'findOne').mockResolvedValue(product);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove(user, id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id, user } });
      expect(repository.remove).toHaveBeenCalledWith(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      const user = { id: 1 } as User;
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(user, id)).rejects.toThrow(NotFoundException);
    });
  });
});
