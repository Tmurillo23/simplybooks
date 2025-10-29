import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getToken } from '../utils/token-utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    
    if (!token) {
      throw new ForbiddenException("Unauthorized session");
    }
    
    try {
      const payload = this.jwtService.verify(getToken(token));
      request.user = payload; // Attach user payload to request
    } catch (error) {
      throw new ForbiddenException("Session expired");
    }
    return true;
  }
}