import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AuthGuard } from '../auth/guards/auth-guard.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Put('/add-user/:conversationId')
  @ApiParam({ name: 'conversationId', required: true })
  addUserToConversation(
    @Param('conversationId') conversationId: string,
    @Req() req: Request,
  ) {
    return this.conversationService.joinUserToConversation({
      conversationId,
      user: req['user'],
    });
  }

  @Post('/')
  createConversation(
    @Body() param: CreateConversationDto,
    @Req() req: Request,
  ) {
    return this.conversationService.createConversation({
      ...param,
      ownerId: req['user'].id,
    });
  }

  @Put('/')
  updateConversation(
    @Body() param: UpdateConversationDto,
    @Req() req: Request,
  ) {
    return this.conversationService.updateConversation({
      ...param,
      ownerId: req['user'].id,
    });
  }

  @Delete('/:conversationId')
  @ApiParam({ name: 'conversationId', required: true })
  deleteConversation(
    @Param('conversationId') conversationId: string,
    @Req() req: Request,
  ) {
    return this.conversationService.deleteConversation({
      conversationId,
      user: req['user'],
    });
  }

  @Get('/:conversationId')
  @ApiParam({ name: 'conversationId', required: true })
  getConversation(@Param('conversationId') conversationId: string) {
    return this.conversationService.getConversation(conversationId);
  }

  @Get('/')
  getPublicConversations(@Req() req: Request) {
    return this.conversationService.getPublicConversations(req['user'].id);
  }

  @Get('/my/joined')
  getJoinedConversations(@Req() req: Request) {
    return this.conversationService.getJoinedConversations(req['user'].id);
  }

  @Get('/leave-kick/:conversationId/:userId')
  @ApiParam({ name: 'conversationId', required: true })
  @ApiParam({ name: 'userId', required: true })
  leaveOrKickFromConversation(
    @Param('conversationId') conversationId: string,
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    return this.conversationService.leaveOrKickUser({
      conversationId,
      userId,
      user: req['user'],
    });
  }
}
