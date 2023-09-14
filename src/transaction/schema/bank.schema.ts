/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';


import * as mongoosePaginate from 'mongoose-paginate';

import { User } from "src/users/schema/user.schema";



@Schema({ timestamps: true })
export class Bank {
          @Prop({})
          accountName: string;
          @Prop({})
          accountNumber: string;
          @Prop({})
          bankName: string;
    
          @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
          userId: User;
        
          

         
}
export const BankSchema = SchemaFactory.createForClass(Bank);
BankSchema.plugin(mongoosePaginate);

