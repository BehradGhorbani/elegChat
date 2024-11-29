import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public conversationId: string;

  @Column()
  public text: string;

  @Column()
  public userId: string;

  @Column()
  public senderName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt: Date;
}
