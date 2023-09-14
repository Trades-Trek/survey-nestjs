import { Controller, Delete, Get, Query, Put, Body } from '@nestjs/common';
import { AuthUser } from 'src/users/middleware/auth.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificataionService: NotificationsService) {}

  @Get('')
  async getUserAllNotification(
    @AuthUser() userId: string,
    @Query('page') page: number,
  ) {
    return await this.notificataionService.getUserAllNotification(userId, page);
  }
  @Get('count')
  async notificationCount(@AuthUser() userId: string) {
    return await this.notificataionService.notificationCount(userId);
  }

  @Delete('')
  async deleteNotificationById(
    @AuthUser() userId: string,
    @Query('id') id: string,
  ) {
    return await this.notificataionService.deleteNotificationById(userId, id);
  }
  @Delete('all')
  async deleteAllNotifications(@AuthUser() userId: string) {
    return await this.notificataionService.deleteAllNotifications(userId);
  }
  @Put('update-status')
  async updateStatus(
    @AuthUser() userId: string,
    @Body() notificationIds: string[],
  ) {
    return await this.notificataionService.notificationUpdateStatus(userId, notificationIds);
  }
}
