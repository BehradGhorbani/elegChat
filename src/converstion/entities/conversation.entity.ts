import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationStatus } from '../enums/conversation.enum';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public ownerId: string;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public status: ConversationStatus;

  @Column('text', { array: true, default: '{}' })
  public users: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
