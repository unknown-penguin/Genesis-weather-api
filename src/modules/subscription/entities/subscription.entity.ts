import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Frequency } from '../enums/frequency.enum';

@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  city: string;

  @Column({
    type: 'enum',
    enum: Frequency,
    nullable: true,
  })
  frequency: Frequency;

  @Column({ type: 'varchar', nullable: true })
  token: string;

  @Column({ type: 'varchar', nullable: true })
  unsubscribeToken: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  unsubscribedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
