import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Survey extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  questions: [{
    question: string;
    options: [string];
    basicPrice: number;
    normalPrice: number;
    premiumPrice: number;
    standardPrice: number;
  }];

  @Prop({ required: true, unique: true })
  slug: string;

}

export const SurveySchema = SchemaFactory.createForClass(Survey);

function generateSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

SurveySchema.pre('save', async function(next) {
  const survey = this;
  survey.slug = generateSlug(survey.title);
  survey.slug += '-' + Date.now();

  next();
})




