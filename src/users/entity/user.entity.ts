import { Document } from "mongoose";

export class User extends Document{
    readonly fullName:string;
    readonly email:string;
    readonly phone:string;
    readonly username:string;
    readonly password:string;
    readonly referalCode:string;
    readonly status:number;
    readonly createdAt:string;
    readonly updatedAt:string;
    readonly subscription:boolean
    readonly block:boolean
    readonly firstSubscription:boolean
    readonly expiredDate:Date
    readonly filePath:string
  readonly  yourRefferal:string
}