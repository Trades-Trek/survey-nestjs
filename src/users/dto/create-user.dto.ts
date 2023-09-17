/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;


  @IsNotEmpty()
  @IsString()
   username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsNotEmpty()
  // @IsString()
  // confirmPassword: string;

  refferalCode:string;
}
