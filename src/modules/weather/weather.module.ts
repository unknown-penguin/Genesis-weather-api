import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherEntity } from './entities/weather.entity';
import { ConfigModule } from '@nestjs/config';
import { WeatherUpdateJobService } from './weather-update-job.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([WeatherEntity]),
    SubscriptionModule, 
    MailModule, 
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherUpdateJobService],
  exports: [WeatherService],
})
export class WeatherModule {}
