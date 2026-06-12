import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @Type(() => String)
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'John' })
  firstName: string;

  @Type(() => String)
  @IsString()
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
  @ApiProperty({ default: 'johndoe@gmail.com' })
  email: string;

  @Type(() => String)
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'password' })
  password: string;
}
