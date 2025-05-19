import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    example: 'daily',
    required: false,
  })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiProperty({
    description: 'The city to receive weather updates for',
    example: 'Kyiv',
  })
  @IsNotEmpty()
  @IsString()
  city: string;
}
