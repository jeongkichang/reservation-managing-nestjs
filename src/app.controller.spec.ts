import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Reflector } from '@nestjs/core';
import { User } from './users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AuthService,
        UsersService,
        LocalAuthGuard,
        Reflector,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    appController = moduleRef.get<AppController>(AppController);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const body = { username: 'testuser', password: 'testpassword' };
      const result: User = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword', // 필요한 경우 더미 값 사용
        products: [], // User 엔티티의 다른 필드를 채웁니다.
      };

      jest.spyOn(authService, 'register').mockImplementation(async () => result);

      expect(await appController.register(body)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(body.username, body.password);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const req = {
        user: { username: 'testuser' },
      };
      const result = 'test-token';

      jest.spyOn(authService, 'login').mockImplementation(async () => result);

      expect(await appController.login(req as any)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(req.user);
    });
  });
});
