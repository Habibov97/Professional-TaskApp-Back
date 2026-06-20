import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Title must be a string' })
  @MinLength(3)
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @ApiProperty({ required: true })
  title: string;

  @IsUUID('4', {
    message: 'Parent must be a valid UUID',
  })
  @IsNotEmpty({ message: 'ParentId is required' })
  @ApiProperty({ required: true })
  parentId: string;
}
