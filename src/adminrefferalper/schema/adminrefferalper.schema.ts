/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


import * as mongoosePaginate from 'mongoose-paginate';




@Schema({ timestamps: true })
export class AdminRefferalPer {

          @Prop({ default: 20 })
          per: Number;
          @Prop({ default: 'Admin' })
          userType: String

}
export const AdminRefferalPerSchema = SchemaFactory.createForClass(AdminRefferalPer);
AdminRefferalPerSchema.plugin(mongoosePaginate);

