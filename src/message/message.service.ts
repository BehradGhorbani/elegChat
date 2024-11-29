import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationEntity } from '../converstion/entities/conversation.entity';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserWithMessageDto } from './dto/user-with-message.dto';
import { UserWithConversationDto } from '../converstion/dto/user-with-conversation.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createMessage(param: CreateMessageDto): Promise<MessageEntity> {
    const conversation = await this.conversationRepository.findOneBy({
      id: param.conversationId,
    });
    if (!conversation) {
      throw new NotFoundException('Conversation Not Found.');
    }

    if (!conversation.users.includes(param.user.id)) {
      throw new NotFoundException('Operation is Forbidden.');
    }

    param.text = param.text.trim();
    param.senderName = param.user.email.split('@')[0];
    return this.messageRepository.save({
      ...param,
      userId: param.user.id,
    });
  }

  async updateMessage(param: UpdateMessageDto): Promise<boolean> {
    param.text = param.text.trim();
    const result = await this.messageRepository.update(
      { id: param.id },
      {
        text: param.text,
      },
    );

    const isAffected = !!result.affected;

    if (!isAffected)
      throw new InternalServerErrorException(
        'There was an error in update message',
      );

    return isAffected;
  }

  async getConversationMessages(
    param: UserWithConversationDto,
  ): Promise<MessageEntity[]> {
    const conversation = await this.conversationRepository.findOneBy({
      id: param.conversationId,
    });

    if (!conversation || !conversation.users.includes(param.user.id)) {
      throw new NotFoundException(
        'Conversation Not Found or User is Not Joined!',
      );
    }

    return this.messageRepository.findBy({
      conversationId: param.conversationId,
    });
  }

  async deleteMessage(params: UserWithMessageDto): Promise<boolean> {
    const message = await this.messageRepository.findOneBy({
      id: params.messageId,
    });

    if (!message || message.userId !== params.user.id) {
      throw new NotFoundException('Operation is Forbidden.');
    }

    const result = await this.messageRepository.delete(params.messageId);

    const isAffected = !!result.affected;

    if (!isAffected)
      throw new InternalServerErrorException(
        'There was an error in Remove Message',
      );

    return isAffected;
  }
}
