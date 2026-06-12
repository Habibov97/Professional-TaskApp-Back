import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'johndoe' })
  userName: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'password' })
  password: string;
}
