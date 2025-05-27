import { Controller, Post, Body, UnauthorizedException, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { blacklistToken } from './token-blacklist';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return this.authService.login(user);
  }

  // Logout route – requires valid JWT
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Headers('authorization') authHeader: string) {
    // Extract token from 'Bearer <token>'
    const token = authHeader?.split(' ')[1];
    if (token) {
      blacklistToken(token);
    }
    return this.authService.logout(req.user);
  }
}
