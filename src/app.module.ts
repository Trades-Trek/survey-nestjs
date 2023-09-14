import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from './logging/logging.module';
import { UsersModule } from './users/users.module';
import { ENV } from 'config/environment';
import { AdminSchema } from './admin/schema/admin.schema';
import { AdminModule } from './admin/admin.module';
import { AuthUserMiddleware } from './users/middleware/auth.user.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AuthAdminMiddleware } from './admin/middleware/auth.admin.middleware';
import { ScheduleModule } from '@nestjs/schedule';

import { NotificationsModule } from './notifications/notifications.module';
import { UserrefferalModule } from './userrefferal/userrefferal.module';
import { AdminrefferalperModule } from './adminrefferalper/adminrefferalper.module';
import { ControlSchema } from './admin/schema/control.schema';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [
    MongooseModule.forRoot(ENV.DB_URL),
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: 'Control', schema: ControlSchema },
    ]),
    EventEmitterModule.forRoot(),
    LoggingModule,
    UsersModule,
    AdminModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: ENV.JWT_SECRET_KEY,
      signOptions: { expiresIn: '365d' },
    }),
    NotificationsModule,

    UserrefferalModule,
    AdminrefferalperModule,
 
    BankModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthAdminMiddleware)
      .exclude({ path: 'admin/login', method: RequestMethod.POST, },{ path: 'admin/otp-verify', method: RequestMethod.GET, }, { path: 'admin/resetPassword', method: RequestMethod.GET, })
      .forRoutes('admin');
    consumer
      .apply(AuthUserMiddleware)
      .forRoutes(
        'user/changePassword',
        'user/uploadProfile',
        'user/stock/*',
        'user/order',
        'user/get/info',
        'user/performanceHistory',
      );
  }
}
