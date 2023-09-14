/* eslint-disable prettier/prettier */
import { IsNotEmpty,  IsNumber, IsString } from 'class-validator';
export class updateSubscriptionDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  subscription: string;
}