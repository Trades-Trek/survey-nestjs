import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class SurveyBalance  extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Survey' })
  surveyId: ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  balance: number;
}

export const SurveyBalanceSchema = SchemaFactory.createForClass(SurveyBalance);
