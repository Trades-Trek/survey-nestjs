import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import app from '../../config/firebase.config'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Admin } from 'src/admin/schema/admin.schema';
import {
  HelpAndSupport,
  HelpAndSupportAdmin,
  SendReviewToAdmin,
} from 'src/helpers/SendEmail.service';
import { User } from 'src/users/schema/user.schema';
import { Support } from './schema/support.schem';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel('Admin') private adminModel: Model<Admin>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Support') private supportModel: Model<Support>,
  ) {}
  async createSupport(userId, body) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found!',
        };
      }

      await this.supportModel.create({
        userId: userId,
        title: body.title,
        description: body.description,
        type: body.type,
      });

      if (body.type === 'Request') {
        HelpAndSupport(user, body.title);
        SendReviewToAdmin(body,  user);
      }

      if (body.type === 'Review') {
        HelpAndSupport(user, body.title);
        SendReviewToAdmin(body,  user);
      }

      return {
        success: true,
        message: 'Request Send Successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }


  async createSupportWithImage(userId, body, imageFile) {
    try {

      const storage = getStorage(app);

         // @ts-ignore
     const storageRef = ref(storage, imageFile.originalname);
     const snapshot = await uploadBytes(storageRef, imageFile.buffer);
     const url = await getDownloadURL(snapshot.ref);

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found!',
        };
      }

      await this.supportModel.create({
        userId: userId,
        title: body.title,
        description: body.description,
        type: body.type,
      });

      body.url = url

      if (body.type === 'Request') {
        HelpAndSupport(user, body.title);
        SendReviewToAdmin(body,  user);
      }

      if (body.type === 'Review') {
        HelpAndSupport(user, body.title);
        SendReviewToAdmin(body,  user);
      }

      return {
        success: true,
        message: 'Request Send Successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  async allSupport(userId, page = 1, search = '', body) {
    try {
      const admin = await this.adminModel.findById(userId);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      const support = await this.supportModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            title: 1,
            description: 1,

            username: '$user.username',
            createdAt: -1,
            orderId: 1,
          },
        },
        {
          $match: {
            $or: [
              { title: { $regex: `.*${search}.*`, $options: 'i' } },
              { description: { $regex: `.*${search}.*`, $options: 'i' } },
              { username: { $regex: `.*${search}.*`, $options: 'i' } },
            ],
          },
        },
        {
          $sort: body,
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            entries: { $push: '$$ROOT' },
          },
        },
        {
          $addFields: {
            entries: { $slice: ['$entries', (page - 1) * 10, 10] },
          },
        },
      ]);
      return {
        success: true,
        data: support[0]?.entries || [],
        totalPage: Math.ceil((support[0]?.count || 1) / 10),
        page: page,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  async allSupportDownload(userId, search = '', body) {
    try {
      const admin = await this.adminModel.findById(userId);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found!.',
        };
      }
      const support = await this.supportModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            title: 1,
            description: 1,

            username: '$user.username',
            createdAt: -1,
            orderId: 1,
          },
        },
        {
          $match: {
            $or: [
              { title: { $regex: `.*${search}.*`, $options: 'i' } },
              { description: { $regex: `.*${search}.*`, $options: 'i' } },
              { username: { $regex: `.*${search}.*`, $options: 'i' } },
            ],
          },
        },
        {
          $sort: body,
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            entries: { $push: '$$ROOT' },
          },
        },
      ]);
      return {
        success: true,
        data: support[0]?.entries || [],
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
