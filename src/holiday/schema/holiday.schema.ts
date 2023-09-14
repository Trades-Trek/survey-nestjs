import { NestFactory } from '@nestjs/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

@Schema({timestamps: true})
export class Holiday {
  @Prop({required:true})
  holidayDate: string;
  @Prop({required:true})
  holidayName: string;
  @Prop({required:true})
  holidayMessage: string;


}
export const HolidaySchema = SchemaFactory.createForClass(Holiday);
HolidaySchema.plugin(mongoosePaginate);

