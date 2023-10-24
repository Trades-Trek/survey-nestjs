import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';


@Schema()
export class WithdrawalRequest extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({
    required: true,
    enum: ['paypal', 'bank_account', 'cryptocurrency', 'amazon_gift_card'],
  })
  paymentMethod: string;

  @Prop({ required: true, enum: ['referral', 'survey'] })
  referralOrSurvey: string;

  @Prop({ required: true })
  amount: number;

  @Prop({
    default: 'awaiting_admin_approval',
    required: true,
    enum: ['awaiting_admin_approval', 'approved', 'rejected'],
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  approvedBy?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  rejectedBy?: string;

  @Prop()
  rejectionReason?: string;

  @Prop()
  cryptoWallet?: string;
}

export const WithdrawalRequestSchema =
  SchemaFactory.createForClass(WithdrawalRequest);
