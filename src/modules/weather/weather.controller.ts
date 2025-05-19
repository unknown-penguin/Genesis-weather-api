import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/weather')
  @ApiOperation({ summary: 'Get current weather for a city' })
  @ApiQuery({
    name: 'city',
    required: true,
    description: 'City name for weather forecast',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation - current weather forecast returned',
    schema: {
      type: 'object',
      properties: {
        temperature: { type: 'number', description: 'Current temperature' },
        humidity: { type: 'number', description: 'Current humidity percentage' },
        description: { type: 'string', description: 'Weather description' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async getWeatherByCity(@Query('city') city: string): Promise<{
    temperature: number;
    humidity: number;
    description: string;
  }> {
    if (!city) {
      throw new HttpException(
        'City query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.weatherService.getWeatherForCity(city);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unknown error', HttpStatus.BAD_REQUEST);
    }
  }
}
