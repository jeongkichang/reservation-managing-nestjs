import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if validation is successful', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedpassword' } as User;
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'testpassword');

      expect(result).toEqual({ id: 1, username: 'testuser' });
      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedpassword');
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser('testuser', 'testpassword');

      expect(result).toBeNull();
      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
    });

    it('should return null if password is incorrect', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedpassword' } as User;
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'testpassword');

      expect(result).toBeNull();
      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedpassword');
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const user = { id: 1, username: 'testuser' };
      const token = 'test-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(user);

      expect(result).toEqual(token);
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'testuser', sub: 1 });
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const user = { id: 1, username } as User;
      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const result = await service.register(username, password);

      expect(result).toEqual(user);
      expect(usersService.create).toHaveBeenCalledWith(username, password);
    });
  });
});
