import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schema/notification.schama';
import * as PaginateModel from 'mongoose-paginate';
import mongoose, { Model } from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { User } from 'src/users/schema/user.schema';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification')
    private notificationModel: PaginateModel<Notification>,

    @InjectModel('User') private userModel: Model<User>,
  ) {}
  async getUserAllNotification(id, page) {
    let data;

    try {
      if (page) {
        const option = {
          page: page,
          limit: 5,
          sort: { createdAt: -1 },
        };
        data = await this.notificationModel.paginate(
          { userId: new mongoose.Types.ObjectId(id) },
          option,
        );
      } else {
        data = await this.notificationModel.find( { userId: new mongoose.Types.ObjectId(id) });
      }
      return {
        success: true,
        message: 'Retreived Successfully',
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Internal Server Error',
        data: null,
      };
    }
  }
  async notificationCount(userId) {
    try {
      const count = await this.notificationModel.count({
        userId: new mongoose.Types.ObjectId(userId),
        status: true,
      });
      return {
        success: true,
        message: 'Created Successfully',
        data: count,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
  async deleteNotificationById(userId, id) {
    try {
      await this.notificationModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Internal Server Error',
        data: null,
      };
    }
  }
  async deleteAllNotifications(userId) {
    try {
      await this.notificationModel.deleteMany({ userId: userId });
      return {
        success: true,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Internal Server Error',
      };
    }
  }
  async notificationUpdateStatus(userId, notificationIds) {
    await this.notificationModel.updateMany(
      { userId: userId, _id: { $in: notificationIds } },
      { status: false },
    );
    return {
      success: true,
      message: 'success',
    };
  }
}
