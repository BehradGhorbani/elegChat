import { User } from '../../users/entities/user';

export class UserWithMessageDto {
  messageId: string;

  user: User;
}
