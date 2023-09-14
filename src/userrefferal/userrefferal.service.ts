import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as PaginateModel from 'mongoose-paginate';
import { Admin } from 'src/admin/schema/admin.schema';

import { InviteFriends } from 'src/helpers/SendEmail.service';
import { User } from 'src/users/schema/user.schema';
import { UserRefferal } from './schema/userrefferal.schema';

@Injectable()
export class UserrefferalService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,

    @InjectModel('Admin') private adminModel: Model<Admin>,
    @InjectModel('Notification')
    private notificationModel: PaginateModel<Notification>,
    @InjectModel('UserRefferal')
    private userrefferalModel: PaginateModel<UserRefferal>,
  ) { }

  async sendRefferal(userId: string, Body) {

    try {
      const user = await this.userModel.findById(userId)
      if (!user) {
        return {
          success: false,
          message: "User not found",
          data: Body
        }
      }

     const { emails }  =  Body

      await Promise.all(
        emails.map(async (email) => {
          const isExist = await this.userrefferalModel.findOne({
            userId: user._id,
            email,
          });
          if (!isExist) {
            await this.userrefferalModel.create({
              userId: user._id,
              refferalCode: user.yourRefferal,
              email,
              send: true,
            });
          }
          await InviteFriends(email, user);
        })
      );
  
      return {
        success: true,
        message: "Send Successfully.",
        data: Body
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }


  }
  async refferalInfo(userId: string) {
    try {
      const totalRefferal = await this.userrefferalModel.count({ userId: userId })
      const joinedRefferal = await this.userrefferalModel.count({ userId: userId, joined: true })
      const redeemRefferal = await this.userrefferalModel.count({ userId: userId, redeem: true })

      return {
        success: true,
        message: "Send Successfully.",
        data: {
          totalRefferal,
          joinedRefferal,
          redeemRefferal
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }

    }
  }
  async adminRefferalList(userId: string, search: string, page: number, body) {
    try {

      const admin = await this.adminModel.findById(userId)
      if (!admin) {
        return {
          success: false,
          message: 'You are not authorized'
        }
      }

      const Refferal = await this.userrefferalModel.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'userId'
          }
        }, {
          '$unwind': {
            'path': '$userId'
          }
        }, {
          '$match': {
            $or: [{ email: { '$regex': `.*${search}.*`, '$options': 'i' } }, { refferalCode: { '$regex': `.*${search}.*`, '$options': 'i' } }, { 'userId.username': { '$regex': `.*${search}.*`, '$options': 'i' } }],
            ...body.fileterOption
          }
        },{
          "$sort":{
            ...body.option
          }
        }, {
          '$group': {
            '_id': null,
            'count': { '$sum': 1 },
            'entries': { '$push': "$$ROOT" }
          }
        }, {
          '$addFields': {
            entries: { $slice: ["$entries", (page-1)*10, 10] }
          }
        }
      ])



      return {
        success: true,
        data: Refferal[0]?.entries || [],
        totalPage: Math.ceil((Refferal[0]?.count || 1) / 10),
        page: page,
        message: 'All Refferal'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }

    }
  }
  async downloadAdminRefferal(userId: string, search: string, body) {
    try {

      const admin = await this.adminModel.findById(userId)
      if (!admin) {
        return {
          success: false,
          message: 'You are not authorized'
        }
      }

      const Refferal = await this.userrefferalModel.aggregate([
        {
          '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'userId'
          }
        }, {
          '$unwind': {
            'path': '$userId'
          }
        }, {
          '$match': {
            $or: [{ email: { '$regex': `.*${search}.*`, '$options': 'i' } }, { refferalCode: { '$regex': `.*${search}.*`, '$options': 'i' } }, { 'userId.username': { '$regex': `.*${search}.*`, '$options': 'i' } }],
            ...body.fileterOption
          }
        },{
          "$sort":{
            ...body.option
          }
        },{
          '$project':{
            email:1,
            _id:1,
            createdAt:1,
            joined:1,
            per:1,
            redeem:1,
            refferalCode:1,
            send:1,
            updatedAt:1,
            username:{ $toLower: "$userId.username" }
          }
        }
      ])



      return {
        success: true,
        data: Refferal,
       
        message: 'All Refferal'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }

    }
  }
}
