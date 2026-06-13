import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUrl,
  IsLowercase,
  IsAlphanumeric,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @Type(() => String)
  @IsString()
  @MinLength(3)
  @IsAlphanumeric('en-US', { message: 'First name must be alphanumeric' })
  @ApiProperty({ default: 'John' })
  firstName: string;

  @Type(() => String)
  @IsString()
  @IsAlphanumeric('en-US', { message: 'First name must be alphanumeric' })
  @MinLength(3)
  @ApiProperty({ default: 'Doe' })
  lastName: string;

  @Type(() => String)
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ default: 'JohnDoe' })
  userName: string;

  @IsEmail()
  @IsLowercase({ message: 'Email must be lowercase' })
  @ApiProperty({ default: 'johndoe@gmail.com' })
  email: string;

  @Type(() => String)
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'password' })
  password: string;
}
