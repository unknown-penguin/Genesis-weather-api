import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { SubscriptionEntity } from '../modules/subscription/entities/subscription.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GMAIL_CLIENT_ID'),
      this.configService.get<string>('GMAIL_CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get<string>('GMAIL_REFRESH_TOKEN'),
    });

    oauth2Client.getAccessToken().then((accessToken) => {
      if (!accessToken?.token) {
        this.logger.error('Failed to retrieve access token');
        throw new Error('Failed to retrieve access token');
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get<string>('GMAIL_USER'),
          clientId: this.configService.get<string>('GMAIL_CLIENT_ID'),
          clientSecret: this.configService.get<string>('GMAIL_CLIENT_SECRET'),
          refreshToken: this.configService.get<string>('GMAIL_REFRESH_TOKEN'),
          accessToken: this.configService.get<string>('GMAIL_ACCESS_TOKEN'),
        },
      });
    }).catch((error) => {
      this.logger.error('Error initializing OAuth2 client', error);
      throw new Error('Error initializing OAuth2 client');
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    if (!this.transporter) {
      this.logger.error('Transporter is not initialized');
      throw new Error('Transporter is not initialized');
    }
    this.logger.log(`Sending email to ${to} with subject "${subject}"`);
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('GMAIL_FROM'),
        to,
        subject,
        text,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw new Error('Failed to send email');
    }
  }

  async sendSubscriptionConfirmation(subscription: SubscriptionEntity): Promise<void> {
    const { email, token } = subscription;
    const confirmationUrl = `${this.configService.get<string>('APP_URL')}/confirm?token=${token}`;

    await this.sendMail(
      email,
      'Subscription Confirmation',
      `Please confirm your subscription by clicking the following link: ${confirmationUrl}`,
    );
  }

  async sendWeatherUpdate(email: string, weatherData: any, unsubscribeToken: string): Promise<void> {
    const unsubscribeLink = `${this.configService.get<string>('APP_URL')}/unsubscribe?token=${unsubscribeToken}`;

    await this.sendMail(
      email,
      'Weather Update',
      `Here is your latest weather update: ${JSON.stringify(weatherData)}. To unsubscribe, click here: ${unsubscribeLink}`,
    );
  }
}
