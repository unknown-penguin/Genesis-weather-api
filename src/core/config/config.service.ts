import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get databaseUrl(): string {
    const url = this.nestConfigService.get<string>('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL is not defined in the environment variables');
    }
    return url;
  }

  get appPort(): number {
    return this.nestConfigService.get<number>('APP_PORT', 3000);
  }
}
