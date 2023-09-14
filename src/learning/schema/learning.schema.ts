import { NestFactory } from '@nestjs/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { Category } from './category.schema';

@Schema({timestamps: true})
export class Learning {
  
  @Prop({required:true})
  title: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    categoryId: Category;
  @Prop({required:true})
  url: string;



}
export const LearningSchema = SchemaFactory.createForClass(Learning);
LearningSchema.plugin(mongoosePaginate);

