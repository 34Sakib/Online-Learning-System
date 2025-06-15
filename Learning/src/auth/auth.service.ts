import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginId: string, pass: string): Promise<any> {
    // Try to find user by username or email
    let user = await this.userService.findByUsername(loginId);
    if (!user) {
      user = await this.userService.findByEmail?.(loginId);
    }
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, role: user.role, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name || user.username,
        email: user.email && user.email.trim() !== '' ? user.email : user.username,
        role: user.role,
      },
      message: `Login successful, welcome ${user.role}`,
    };
  }

  logout(user: any) {
    return { message: `Logout successful for ${user.username}` };
  }
}
