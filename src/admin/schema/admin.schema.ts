/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ required: true, unique: true, trim: true })
  email: string;
  @Prop({ required: true, unique: true, trim: true })
  username: string;
  @Prop({ required: true, trim: true })
  password: string;
  @Prop({ default: Date.now(), trim: true })
  createdAt: Date;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
