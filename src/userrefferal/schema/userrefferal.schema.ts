/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate';
import { User } from 'src/users/schema/user.schema';



@Schema({ timestamps: true })
export class UserRefferal {

          @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
          userId: User;
          @Prop({})
          refferalCode:string;
          @Prop({})
          email:string;
          @Prop({default:false})
          redeem:boolean
          @Prop({default:false})
          joined:boolean
          @Prop({default:0})
          per:Number
          @Prop({default:false})
          send:boolean

 


}
export const UserRefferalSchema = SchemaFactory.createForClass(UserRefferal);
UserRefferalSchema.plugin(mongoosePaginate);
// UserSchema.index({ title: 'text', description: 'text', tags: 'text' });
