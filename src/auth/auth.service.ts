import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<Record<string, any>> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
