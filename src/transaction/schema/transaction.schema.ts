/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


import * as mongoosePaginate from 'mongoose-paginate';

import { User } from "src/users/schema/user.schema";



@Schema({ timestamps: true })
export class Transaction {
          @Prop({})
          accountName: string;
          @Prop({})
          accountNumber: string;
          @Prop({})
          bankName: string;
          @Prop({enum:['Pending','Process',"Failed","Success"],default:'Pending'})
          status: string;
          @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
          userId: User;
          @Prop({})
          reqAmount: Number;
          @Prop({default:''})
          reason:String
          

         
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.plugin(mongoosePaginate);

