import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

interface WeatherData {
  Temperature: {
    Metric: {
      Value: number;
    };
  };
  RelativeHumidity: number;
  WeatherText: string;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchWeatherData(city: string): Promise<WeatherData> {
    const apiKey = 'htHi8hYhWvS3yRXrucHbRlmjsXgftGyU'; 
    const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

    try {
      const locationResponse = await lastValueFrom(
        this.httpService.get(locationUrl),
      );
      const locationKey = locationResponse.data[0]?.Key;

      if (!locationKey) {
        throw new HttpException(
          `City not found: ${city}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const conditionsUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;
      const conditionsResponse = await lastValueFrom(
        this.httpService.get<WeatherData>(conditionsUrl),
      );

      return conditionsResponse.data[0];
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather data for city: ${city}`,
        error,
      );
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getWeatherForCity(
    city: string,
  ): Promise<{ temperature: number; humidity: number; description: string }> {
    const data = await this.fetchWeatherData(city);
    return {
      temperature: data.Temperature.Metric.Value,
      humidity: data.RelativeHumidity,
      description: data.WeatherText,
    };
  }
}
