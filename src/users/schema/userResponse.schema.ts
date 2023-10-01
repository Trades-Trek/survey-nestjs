import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';

@Schema()
export class SurveyResponse extends Document {

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Survey' })
  surveyId: ObjectId;

  @Prop({ type: Object, required: true })
  answers:  [{
    question: string;
    option: string;
  }];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

}

export const SurveyResponseSchema = SchemaFactory.createForClass(SurveyResponse);
