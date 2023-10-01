import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class BankAccount extends Document {
  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
