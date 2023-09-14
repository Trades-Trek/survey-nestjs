import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserProfile {
  @Prop()
  email: string;
  @Prop()
  filePath: string;

  @Prop()
  baseUrl: string;

  @Prop()
  mimeType: string;
}
export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
