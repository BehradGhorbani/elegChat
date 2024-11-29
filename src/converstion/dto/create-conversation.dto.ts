import {IsArray, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConversationStatus } from '../enums/conversation.enum';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  status: ConversationStatus;

  ownerId: string;

  users: string[];
}
