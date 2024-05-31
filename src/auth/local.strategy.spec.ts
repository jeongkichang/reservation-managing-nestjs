import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when validation is successful', async () => {
      const user = { id: 1, username: 'testuser' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);

      const result = await strategy.validate('testuser', 'testpassword');

      expect(result).toEqual(user);
      expect(authService.validateUser).toHaveBeenCalledWith('testuser', 'testpassword');
    });

    it('should throw UnauthorizedException when validation fails', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(strategy.validate('testuser', 'testpassword')).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith('testuser', 'testpassword');
    });
  });
});
