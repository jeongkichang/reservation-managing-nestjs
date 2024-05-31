import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProfileController', () => {
  let controller: ProfileController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const req = { user: { username: 'testuser' } };
      const user = new User();
      user.id = 1;
      user.username = 'testuser';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await controller.getProfile(req as any);
      expect(result).toEqual({ userId: user.id, username: user.username });
      expect(usersService.findOne).toHaveBeenCalledWith(req.user.username);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      const req = { user: { id: 1 } };
      const body = { username: 'newuser', password: 'newpassword' };

      jest.spyOn(usersService, 'update').mockResolvedValue(undefined);

      const result = await controller.updateProfile(req as any, body);
      expect(result).toEqual({ message: 'Profile updated successfully' });
      expect(usersService.update).toHaveBeenCalledWith(req.user.id, body.username, body.password);
    });

    it('should throw conflict exception if username already exists', async () => {
      const req = { user: { id: 1 } };
      const body = { username: 'existinguser', password: 'newpassword' };

      jest.spyOn(usersService, 'update').mockRejectedValue(new ConflictException('Username already exists'));

      await expect(controller.updateProfile(req as any, body)).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteProfile', () => {
    it('should delete the user profile', async () => {
      const userId = 1;
      const req = { user: { id: userId } };

      jest.spyOn(usersService, 'delete').mockResolvedValue(undefined);

      const result = await controller.deleteProfile(userId, req as any);
      expect(result).toEqual({ message: 'Account deleted successfully' });
      expect(usersService.delete).toHaveBeenCalledWith(userId);
    });
  });
});
