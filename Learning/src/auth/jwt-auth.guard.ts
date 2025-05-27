// src/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';
import { isTokenBlacklisted } from './token-blacklist';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // Check if token is blacklisted
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (token && isTokenBlacklisted(token)) {
      return false;
    }
    return super.canActivate(context);
  }
}
