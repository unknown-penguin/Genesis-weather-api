import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Frequency } from '../enums/frequency.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The email address of the subscriber',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Whether the subscription is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'The frequency of updates',
    example: Frequency.DAILY,
    required: false,
    enum: Frequency,
  })
  @IsOptional()
  @IsEnum(Frequency)
  frequency?: Frequency;

  @ApiProperty({
    description: 'The city to receive weather updates for',
    example: 'Kyiv',
  })
  @IsNotEmpty()
  @IsString()
  city: string;
}
