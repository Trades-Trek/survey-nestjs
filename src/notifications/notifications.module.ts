import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from 'src/admin/schema/admin.schema';
import { UserSchema } from 'src/users/schema/user.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationSchema } from './schema/notification.schama';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports:[MongooseModule.forFeature([
    {name:'Notification',schema:NotificationSchema},
    {name:"Admin",schema:AdminSchema},
    {name:"User",schema:UserSchema}

  ])]
})
export class NotificationsModule {}
