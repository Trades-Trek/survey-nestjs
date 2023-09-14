import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

@Schema({timestamps: true})
export class Category {
  @Prop({required:true})
  categoryName: string;
  @Prop()
  baseUrl: string;
  @Prop()
  filePath: string;
  @Prop({default:true})
  status: boolean;
  @Prop({default:false})
  isDeleted: boolean;



}
export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(mongoosePaginate);

