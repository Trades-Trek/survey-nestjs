/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoosePaginate from 'mongoose-paginate';



@Schema({ timestamps: true })
export class User {

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ unique: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true, unique: true, sparse: true })
  username: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop()
  referalCode: string;

  @Prop({ default: 0, trim: true })
  status: number;

  @Prop({ default: '' })
  profileId: string;

  @Prop({ default: 0 })
  accountValue: number;

  @Prop({ default: '' })
  phone: string;


  @Prop({ default: false })
  block: boolean;

  @Prop({ default: "" })
  yourRefferal: string
  @Prop({ default: "" })
  joinedRefferal: string
  @Prop({ default: 0 })
  walletAmount: number
  @Prop({ default: 0 })
  requestAmount: number
  @Prop({ default: 0 })
  withdrawAmount: number
  @Prop({ enum: ["Browser", "Mobile", "Tablet"] ,default:"Browser"})
  device: string
  @Prop({ default: true })
  allowNotification: boolean
  @Prop({ default: 'https://firebasestorage.googleapis.com/v0/b/jambapp-3e437.appspot.com/o/default-user-avatar.png?alt=media&token=e58679af-a9e8-4d91-b8f5-4587be5dc714'})
  profilePic: string;
  @Prop()
  lastSeen: Date
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
// UserSchema.index({ title: 'text', description: 'text', tags: 'text' });
