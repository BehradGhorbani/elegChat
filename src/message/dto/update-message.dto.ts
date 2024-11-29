import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../../users/entities/user';

export class UpdateMessageDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  text: string;

  user: User;
}
