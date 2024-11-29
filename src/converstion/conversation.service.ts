import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { UserWithConversationDto } from './dto/user-with-conversation.dto';
import { ConversationStatus } from './enums/conversation.enum';
import { LeaveKickConversationDto } from './dto/leave-kick-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createConversation(
    param: CreateConversationDto,
  ): Promise<ConversationEntity> {
    return this.conversationRepository.save({
      ...param,
      users: [param.ownerId],
    });
  }

  async updateConversation(param: UpdateConversationDto): Promise<boolean> {

    const result = await this.conversationRepository.update(
      { id: param.id, ownerId: param.ownerId },
      param,
    );

    const isAffected = !!result.affected;

    if (!isAffected)
      throw new InternalServerErrorException(
        'There was an error in update Conversation',
      );

    return isAffected;
  }

  async joinUserToConversation(
    param: UserWithConversationDto,
  ): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: param.conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation Not Found!');
    }

    if (conversation.status === ConversationStatus.PRIVATE) {
      throw new ForbiddenException('Conversation Is Private!');
    }

    if (conversation.users.includes(param.user.id)) {
      throw new ForbiddenException('User is Already Joined.')
    }

    const result = await this.conversationRepository
      .createQueryBuilder()
      .update(ConversationEntity)
      .set({
        users: () => `array_append(users, '${param.user.id}')`,
      })
      .where('id = :id', { id: param.conversationId })
      .execute();

    const isAffected = !!result.affected;

    if (!isAffected)
      throw new InternalServerErrorException(
        'There was an error in add User to Conversation',
      );

    return isAffected;
  }

  async leaveOrKickUser(param: LeaveKickConversationDto): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: param.conversationId,
      },
    });

    if (!conversation || !conversation.users.includes(param.userId)) {
      throw new NotFoundException(
        'Conversation Not Found or User is Not Joined!',
      );
    }

    if (
      param.user.id !== param.userId &&
      param.user.id !== conversation.ownerId
    ) {
      throw new ForbiddenException('Operation Is Forbidden.');
    }

    const result = await this.conversationRepository
      .createQueryBuilder()
      .update(ConversationEntity)
      .set({
        users: () => `array_remove(users, '${param.userId}')`,
      })
      .where('id = :id', { id: param.conversationId })
      .execute();

    const isAffected = !!result.affected;

    if (!isAffected)
      throw new InternalServerErrorException(
        'There was an error in Remove User from Conversation',
      );

    return isAffected;
  }

  async getConversation(id: string): Promise<ConversationEntity | null> {
    return this.conversationRepository.findOneBy({ id });
  }

  async getPublicConversations(userId: string): Promise<ConversationEntity[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where(
        'array_position(conversation.users, :userId) IS NULL AND status= :status',
        {
          userId,
          status: ConversationStatus.PUBLIC,
        },
      )
      .getMany();
  }

  async getJoinedConversations(userId: string): Promise<ConversationEntity[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('array_position(conversation.users, :userId) IS NOT NULL', {
        userId,
      })
      .getMany();
  }

  async deleteConversation(params: UserWithConversationDto): Promise<boolean> {
    const conversation = await this.conversationRepository.findOneBy({
      id: params.conversationId,
    });

    if (!conversation) {
      throw new NotFoundException('Conversation Not Found');
    }

    if (conversation.ownerId !== params.user.id) {
      throw new ForbiddenException('Access Denied!');
    }

    const result = await this.conversationRepository.delete(
      params.conversationId,
    );

    const isAffected = !!result.affected;

    if (!isAffected)
      throw new InternalServerErrorException(
        'There was an error in Remove User from Conversation',
      );

    return isAffected;
  }
}
