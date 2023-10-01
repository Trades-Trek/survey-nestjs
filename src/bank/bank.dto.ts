import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBankAccountDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  accountName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  bankName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  country: string;
}