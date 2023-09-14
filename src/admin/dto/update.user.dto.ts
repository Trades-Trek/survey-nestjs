/* eslint-disable prettier/prettier */
import { MaxLength } from 'class-validator';
export class UpdateUserDto {
  @MaxLength(30)
  firstName: string;
  lastName:string;
  email: string;
  status:number;

  phone: string;

  username: string;
  
}
