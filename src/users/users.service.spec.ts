import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const user = new User();
      user.username = username;

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(username);
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { username } });
    });
  });

  describe('create', () => {
    it('should hash the password and save the user', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const hashedPassword = 'hashedpassword';
      const user = new User();
      user.username = username;
      user.password = hashedPassword;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.create(username, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(repository.create).toHaveBeenCalledWith({ username, password: hashedPassword });
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update the username and password', async () => {
      const userId = 1;
      const newUsername = 'newuser';
      const newPassword = 'newpassword';
      const hashedPassword = 'hashedpassword';
      const user = new User();
      user.id = userId;
      user.username = 'olduser';
      user.password = 'oldpassword';

      jest.spyOn(repository, 'findOne').mockImplementation(async (options: any) => {
        if (options.where.id === userId) {
          return user;
        }
        return null;
      });

      jest.spyOn(repository, 'save').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      await service.update(userId, newUsername, newPassword);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(user.username).toBe(newUsername);
      expect(user.password).toBe(hashedPassword);
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw conflict exception if username already exists', async () => {
      const userId = 1;
      const newUsername = 'existinguser';
      const user = new User();
      user.id = userId;
      user.username = 'olduser';

      jest.spyOn(repository, 'findOne').mockImplementation(async (options: any) => {
        if (options.where.id === userId) {
          return user;
        }
        if (options.where.username === newUsername) {
          return new User();
        }
        return null;
      });

      await expect(service.update(userId, newUsername, 'newpassword')).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete the user by id', async () => {
      const userId = 1;

      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.delete(userId);

      expect(repository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
