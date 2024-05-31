import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const req = { user: { username: 'testuser' } };
      const res = {
        json: jest.fn(),
      };
      const accessToken = 'test-token';

      jest.spyOn(authService, 'login').mockResolvedValue(accessToken);

      await controller.login(req as any, res as any);

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(res.json).toHaveBeenCalledWith({ access_token: accessToken });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const body = { username: 'testuser', password: 'testpassword' };
      const result: User = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        products: [],
      };

      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await controller.register(body)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(body.username, body.password);
    });
  });

  describe('logout', () => {
    it('should return a logged out message', async () => {
      const req = { user: { username: 'testuser' } };

      const result = await controller.logout(req as any);

      expect(result).toEqual({ message: 'Logged out' });
    });
  });
});
