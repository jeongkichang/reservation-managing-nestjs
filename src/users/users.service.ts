import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async update(userId: number, newUsername: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (user) {
      if (newUsername && newUsername !== user.username) {
        const existingUser = await this.usersRepository.findOne({ where: { username: newUsername } });
        if (existingUser) {
          throw new ConflictException('Username already exists');
        }
        user.username = newUsername;
      }

      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
      }

      await this.usersRepository.save(user);
    }
  }

  async delete(userId: number): Promise<void> {
    await this.usersRepository.delete(userId);
  }
}
