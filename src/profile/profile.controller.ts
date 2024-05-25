import { Controller, Get, Post, Delete, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    const user = await this.usersService.findOne(req.user.username);
    return { userId: user.id, username: user.username };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async updateProfile(@Request() req, @Body() body) {
    const { username, password } = body;
    await this.usersService.update(req.user.userId, username, password);
    return { message: 'Profile updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  async deleteProfile(@Param('userId') userId: number, @Request() req) {
    await this.usersService.delete(userId);
    return { message: 'Account deleted successfully' };
  }
}
