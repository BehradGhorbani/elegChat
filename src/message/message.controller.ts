import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query, Delete, Put,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '../auth/guards/auth-guard.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UpdateMessageDto } from './dto/update-message.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/')
  createMessage(@Body() param: CreateMessageDto, @Req() req: Request) {
    return this.messageService.createMessage({
      ...param,
      user: req['user'],
    });
  }

  @Delete('/:messageId')
  @ApiParam({ name: 'messageId', required: true })
  deleteMessage(@Param('messageId') messageId: string, @Req() req: Request) {
    return this.messageService.deleteMessage({
      messageId,
      user: req['user'],
    });
  }

  @Get('/:conversationId')
  @ApiParam({ name: 'conversationId', required: true })
  getConversationMessage(
    @Req() req: Request,
    @Query('conversationId') conversationId: string,
  ) {
    return this.messageService.getConversationMessages({
      conversationId,
      user: req['user'],
    });
  }

  @Put('/')
  updateMessage(@Body() param: UpdateMessageDto, @Req() req: Request) {
    return this.messageService.updateMessage({
      ...param,
      user: req['user']
    });
  }
}
