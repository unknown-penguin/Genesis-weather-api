import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('subscription')
@Controller('api/subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to weather updates' })
  @ApiResponse({
    status: 200,
    description: 'Subscription successful. Confirmation email sent.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    console.log('Received subscription request:', createSubscriptionDto);
    try {
      if (!createSubscriptionDto.email) {
        throw new BadRequestException('Email is required');
      }
      if (!createSubscriptionDto.city) {
        throw new BadRequestException('City is required');
      }
      const subscription = await this.subscriptionService.create(
        createSubscriptionDto,
      );
      if (subscription) {
        return { message: 'Subscription successful. Confirmation email sent.' };
      }
      throw new HttpException(
        'Failed to create subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('confirm/:token')
  @ApiOperation({ summary: 'Confirm email subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription confirmed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  async confirm(@Param('token') token: string) {
    try {
      const result = await this.subscriptionService.confirmSubscription(token);
      if (!result) {
        throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Subscription confirmed successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('unsubscribe/:token')
  @ApiOperation({ summary: 'Unsubscribe from weather updates' })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  async unsubscribe(@Param('token') token: string) {
    try {
      const unsubscribed = await this.subscriptionService.unsubscribe(token);
      if (!unsubscribed) {
        throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Unsubscribed successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
    }
  }
}
