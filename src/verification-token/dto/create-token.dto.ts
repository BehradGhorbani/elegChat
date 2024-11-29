import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresAt: number;

  @ApiProperty()
  isActive: boolean;
}
