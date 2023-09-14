/* eslint-disable prettier/prettier */
import { IsNotEmpty,  IsNumber } from 'class-validator';
export class VerifyEmailDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
