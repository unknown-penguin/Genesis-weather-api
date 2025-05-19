import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from '../subscription/subscription.service';
import { WeatherService } from './weather.service';
import { MailService } from '../../mail/mail.service';
import { Frequency } from '../subscription/enums/frequency.enum';

@Injectable()
export class WeatherUpdateJobService {
  private readonly logger = new Logger(WeatherUpdateJobService.name);

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly weatherService: WeatherService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyUpdates() {
    this.logger.log('Starting hourly weather updates');
    await this.processUpdates(Frequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyUpdates() {
    this.logger.log('Starting daily weather updates');
    await this.processUpdates(Frequency.DAILY);
  }

  private async processUpdates(frequency: Frequency) {
    try {
      const subscriptions = await this.subscriptionService.findByFrequency(frequency);

      for (const subscription of subscriptions) {
        try {
          const weatherData = await this.weatherService.fetchWeatherData(subscription.city);
          await this.mailService.sendMail(
            subscription.email,
            `Weather Update for ${subscription.city}`,
            `Current temperature: ${weatherData.Temperature.Metric.Value}°C\nDescription: ${weatherData.WeatherText}`,
          );
          this.logger.log(`Weather update sent to ${subscription.email} for ${subscription.city}`);
        } catch (error) {
          this.logger.error(
            `Failed to process subscription for ${subscription.email} (${subscription.city}): ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Failed to process ${frequency} updates: ${error.message}`);
    }
  }
}
