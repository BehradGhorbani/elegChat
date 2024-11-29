import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({ require_tld: true })
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
