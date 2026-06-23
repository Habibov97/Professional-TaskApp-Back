import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(5)
  @ApiProperty({ required: true })
  title: string;

  @IsString()
  @MinLength(10)
  @ApiProperty({ required: true })
  description: string;

  @IsUUID('4', { message: 'statusId must be a valid UUID' })
  @ApiProperty({ required: true })
  statusId: string;

  @IsUUID('4', { message: 'priorityId must be a valid UUID' })
  @ApiProperty({ required: true })
  priorityId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  avatar: string;
}
