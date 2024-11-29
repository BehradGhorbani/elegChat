import { User } from '../../users/entities/user';

export class UserWithConversationDto {
  conversationId: string;

  user: User;
}
