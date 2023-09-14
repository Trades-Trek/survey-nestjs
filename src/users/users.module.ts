import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from 'config/environment';

import { OtpSchema } from './schema/otp.schema';
import { UserSchema } from './schema/user.schema';
import { UserProfileSchema } from './schema/userProfile.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { NotificationSchema } from 'src/notifications/schema/notification.schama';
import { UserRefferalSchema } from 'src/userrefferal/schema/userrefferal.schema';
import { ControlSchema } from 'src/admin/schema/control.schema';
import { UserTimeStamp, UserTimeStampSchema } from './schema/userlog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserTimeStamp', schema: UserTimeStampSchema },
     { name: 'Otp', schema: OtpSchema },
      { name: 'UserProfile', schema: UserProfileSchema },

      {name:'Notification',schema:NotificationSchema},
      {name:'UserRefferal',schema:UserRefferalSchema},
      { name: 'Control', schema: ControlSchema },
    ]),
    JwtModule.register({
      secret: ENV.JWT_SECRET_KEY,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
