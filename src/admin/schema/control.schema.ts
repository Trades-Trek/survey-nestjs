/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Control {
  @Prop({ required: true, unique: true, trim: true })
  userId: string;
  @Prop({ required: true, unique: true, trim: true })
  orderId: string;
  @Prop({ required: true, unique: true, trim: true })
  invoiceId: string;
  @Prop({ required: true, unique: true, trim: true })
  gameId: string;
  @Prop({ required: true, unique: true, trim: true })
  subscriptionId: string;
  @Prop({required:true,unique:true,trim:true})
  paymentId:string

}
export const ControlSchema = SchemaFactory.createForClass(Control);
