import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Mongoose } from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';
import { User } from "src/users/schema/user.schema";

@Schema({timestamps:true})
export class Notification{
          @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
          userId: User;
          @Prop()
          message:String
          @Prop()
          username:String
          @Prop({ enum: ['Failed', 'Cancelled',"Success","Deleted"], trim: true })
          type:string
          @Prop({default:true})
          status:boolean


}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.plugin(mongoosePaginate);