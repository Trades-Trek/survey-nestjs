import { IsNotEmpty, IsNumber, IsString, ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @IsNotEmpty()
  @IsString()
  option: string;
}

class QuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray() // Ensure it's an array
  @ArrayMinSize(1) // Ensure there is at least one option
  @IsString({ each: true }) // Ensure each option is a string
  options: string[];
}

export class SurveyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  normalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  basicPrice: number;

  @IsNotEmpty()
  @IsNumber()
  standardPrice: number;

  @IsNotEmpty()
  @IsNumber()
  premiumPrice: number;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsArray() // Ensure it's an array
  @ArrayMinSize(1) // Ensure there is at least one question
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
