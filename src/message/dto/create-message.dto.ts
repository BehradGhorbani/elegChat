import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsString()
  text: string;

  senderName: string;

  user: User;
}
