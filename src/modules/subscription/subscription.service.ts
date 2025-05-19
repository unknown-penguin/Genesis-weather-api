import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { MailService } from '../../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { Frequency } from './enums/frequency.enum';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly mailService: MailService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { email: createSubscriptionDto.email },
    });

    if (existingSubscription) {
      throw new Error('Already subscribed');
    }

    const token = uuidv4();
    const unsubscribeToken = uuidv4();

    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      city: createSubscriptionDto.city,
      token,
      unsubscribeToken,
    });

    const savedSubscription =
      await this.subscriptionRepository.save(subscription);

    await this.mailService.sendSubscriptionConfirmation(savedSubscription);

    return savedSubscription;
  }

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    return this.create(createSubscriptionDto);
  }

  async findOne(id: number): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async remove(id: number): Promise<void> {
    const result = await this.subscriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
  }

  async confirmSubscription(token: string): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { token },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.isConfirmed = true;
    return await this.subscriptionRepository.save(subscription);
  }

  async unsubscribe(token: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOneBy({ token });

    if (!subscription) {
      return false;
    }

    subscription.isActive = false;
    await this.subscriptionRepository.save(subscription);
    return true;
  }

  async findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepository.find({
      where: { frequency, isActive: true },
    });
  }
}
