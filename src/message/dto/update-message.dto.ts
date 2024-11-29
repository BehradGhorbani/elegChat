import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsString } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @ApiProperty()
  @IsString()
  id: string;
}
