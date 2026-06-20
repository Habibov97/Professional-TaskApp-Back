import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto {
  @IsString({ message: 'Title must be a string' })
  @MinLength(3)
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @ApiProperty({ required: true })
  title: string;
}
