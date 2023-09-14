import { IsEmail, IsNotEmpty,IsString } from "class-validator";

export class ChangePasswordDto{

email:string;
    
@IsNotEmpty()
@IsString()
oldPassword:string;

@IsNotEmpty()
@IsString()
newPassword:string;

@IsNotEmpty()
@IsString()
confirmNewPassword:string;

}