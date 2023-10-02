import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class ReferralBalance  extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userWhoReffered: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userUsingReferral: ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  balance: number;
}

export const ReferralBalanceSchema = SchemaFactory.createForClass(ReferralBalance);
