import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from 'src/admin/schema/admin.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { SupportSchema } from './schema/support.schem';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: 'User', schema: UserSchema },
      { name: "Support", schema: SupportSchema }
    ])],
  controllers: [SupportController],
  providers: [SupportService]
})
export class SupportModule { }
