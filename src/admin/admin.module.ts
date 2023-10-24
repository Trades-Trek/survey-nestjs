/* eslint-disable prettier/prettier */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminSchema } from './schema/admin.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ENV } from 'config/environment';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from 'src/users/schema/user.schema';
import { UsersModule } from 'src/users/users.module';

import { HolidaySchema } from 'src/holiday/schema/holiday.schema';

import { NotificationSchema } from 'src/notifications/schema/notification.schama';

import { ControlSchema } from './schema/control.schema';

import { UserTimeStampSchema } from 'src/users/schema/userlog.schema';
import { OtpSchema } from 'src/users/schema/otp.schema';
import { WithdrawalRequestSchema } from 'src/users/schema/userWithDrawal.schema'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: 'UserTimeStamp', schema: UserTimeStampSchema },
      { name: 'WithdrawalRequest', schema :  WithdrawalRequestSchema},
      { name: 'User', schema: UserSchema },

      { name: 'Holiday', schema: HolidaySchema },

      { name: 'Notification', schema: NotificationSchema },

      { name: 'Control', schema: ControlSchema },

      { name: 'Otp', schema: OtpSchema },
    ]),
    JwtModule.register({
      secret: ENV.JWT_SECRET_KEY,
      signOptions: { expiresIn: '365d' },
    }),
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
