import { Controller, Get, Query } from '@nestjs/common';
import { VerificationTokenService } from './verification-token.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('token')
export class VerificationTokenController {
  constructor(private readonly verificationToken: VerificationTokenService) {}

  @ApiQuery({ name: 'email', required: true })
  @Get('/send-token')
  verify(@Query('email') email: string) {
    return this.verificationToken.sendToken(email);
  }
}
