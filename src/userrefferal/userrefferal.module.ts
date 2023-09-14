import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { AdminSchema } from 'src/admin/schema/admin.schema';

import { NotificationSchema } from 'src/notifications/schema/notification.schama';
import { UserSchema } from 'src/users/schema/user.schema';
import { UserRefferalSchema } from './schema/userrefferal.schema';

import { UserrefferalController } from './userrefferal.controller';
import { UserrefferalService } from './userrefferal.service';

@Module({
  controllers: [UserrefferalController],
  providers: [UserrefferalService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      {name:'Admin',schema:AdminSchema},
      {name:'Notification',schema:NotificationSchema},
      {name:'UserRefferal',schema:UserRefferalSchema}


    ]),
  ],
})
export class UserrefferalModule {}
