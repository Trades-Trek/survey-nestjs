/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


import * as mongoosePaginate from 'mongoose-paginate';
import { User } from 'src/users/schema/user.schema';




@Schema({ timestamps: true })
export class Support {

          @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
          userId: User;   
          @Prop()  
          description:string
          @Prop()
          title:string
          @Prop({ enum: ['Review', 'Request'] })
          type: string;

}
export const SupportSchema = SchemaFactory.createForClass(Support);
SupportSchema.plugin(mongoosePaginate);

