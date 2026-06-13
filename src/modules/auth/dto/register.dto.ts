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
  @Type()
  @IsString()
  @MinLength(3)
  @IsAlphanumeric(undefined, { message: 'Firstname must be alphanumeric' })
  @ApiProperty({ default: 'John' })
  firstName: string;

  @Type()
  @IsString()
  @IsAlphanumeric(undefined, { message: 'Lastname must be alphanumeric' })
  @MinLength(3)
  @ApiProperty({ default: 'Doe' })
  lastName: string;

  @Type()
  @IsString()
  @MinLength(3)
  @IsAlphanumeric(undefined, { message: 'Username must be alphanumeric' })
  @MaxLength(20)
  @ApiProperty({ default: 'JohnDoe' })
  userName: string;

  @IsEmail()
  @IsLowercase({ message: 'Email must be lowercase' })
  @ApiProperty({ default: 'johndoe@gmail.com' })
  email: string;

  @Type()
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'password' })
  password: string;
}
