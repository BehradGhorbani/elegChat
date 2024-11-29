import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    request['user'] = await this.authService.verifyToken(token);

    return true;
  }

  private getTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;

    const token = authHeader ? authHeader.replace('Bearer', '') : null;
    return token && token.trim();
  }
}
