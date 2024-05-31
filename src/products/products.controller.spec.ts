import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const req = { user: { id: 1 } };
      const result: Product[] = [
        { id: 1, name: 'Product 1', price: 100, description: 'Desc 1', user: req.user } as Product,
        { id: 2, name: 'Product 2', price: 200, description: 'Desc 2', user: req.user } as Product,
      ];

      jest.spyOn(service, 'findByUser').mockResolvedValue(result);

      expect(await controller.findAll(req as any)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const req = { user: { id: 1 } };
      const productId = 1;
      const result: Product = { id: productId, name: 'Product 1', price: 100, description: 'Desc 1', user: req.user } as Product;

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(req as any, productId)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const req = { user: { id: 1 } };
      const body = { name: 'Product 1', price: 100, description: 'Desc 1' };
      const result: Product = { id: 1, ...body, user: req.user } as Product;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(req as any, body)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const req = { user: { id: 1 } };
      const productId = 1;
      const body = { name: 'Updated Product', price: 150, description: 'Updated Desc' };
      const result: Product = { id: productId, ...body, user: req.user } as Product;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(req as any, productId, body)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const req = { user: { id: 1 } };
      const productId = 1;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(req as any, productId)).toBe(undefined);
      expect(service.remove).toHaveBeenCalledWith(req.user, productId);
    });
  });
});
