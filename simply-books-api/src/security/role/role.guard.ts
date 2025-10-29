import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getToken } from '../utils/token-utils';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    
    if (!token) {
      throw new ForbiddenException("Unauthorized session");
    }

    try {
      const payload = this.jwtService.verify(getToken(token));
      const userId = request.body['userId'] || request.params['userId'] || request.params['id'];
      
      if (userId && userId !== payload['id']) {
        throw new ForbiddenException("Action not allowed");
      }
      
      request.user = payload; // Attach user payload to request
    } catch (error) {
      console.log(error);
      throw new ForbiddenException("Session expired");
    }
    return true;
  }
}