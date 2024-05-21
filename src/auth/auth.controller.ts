import { Controller, Request, Post, UseGuards, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res) {
    const accessToken = await this.authService.login(req.user);
    // 클라이언트에서 리다이렉트 처리하기 위해 토큰을 반환합니다.
    res.json({ access_token: accessToken }); // JSON 형태로 반환
  }

  @Post('register')
  async register(@Body() body) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    // JWT는 상태 비저장형(stateless)이기 때문에 실제 로그아웃 로직은 구현되지 않습니다.
    // 클라이언트에서 토큰을 제거하는 방식으로 로그아웃 처리됩니다.
    return { message: 'Logged out' };
  }
}
