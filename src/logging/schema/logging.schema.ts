import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Mongoose } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
export class Logging {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  username: string;

  @Prop()
  appFeature: string;

  @Prop()
  userAction: string;

  @Prop({ enum: ['Failed', 'Success', 'Ongoing'], trim: true })
  status: string;
}

export const LoggingSchema = SchemaFactory.createForClass(Logging);
LoggingSchema.plugin(mongoosePaginate);
