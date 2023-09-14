import { Schema ,Prop, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';
import { User } from "./user.schema";

@Schema({timestamps:true})
export class UserTimeStamp{
          @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
          userId: User;
  
   
   
}
export const UserTimeStampSchema = SchemaFactory.createForClass(UserTimeStamp);
UserTimeStampSchema.plugin(mongoosePaginate);