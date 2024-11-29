import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { AuthModule } from '../auth/auth.module';
import { ConversationEntity } from '../converstion/entities/conversation.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([MessageEntity, ConversationEntity]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
