/* eslint-disable prettier/prettier */
import { Injectable, Query } from '@nestjs/common';
import { LoginAdminDto } from './dto/login.admin.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { ENV } from 'config/environment';
import { User } from 'src/users/schema/user.schema';
import * as PaginateModel from 'mongoose-paginate';
import { UpdateUserDto } from './dto/update.user.dto';
import axios from 'axios';
import { gameCreateMessage, NegerianHour } from 'src/helpers/NegerianTimeZone';
import { WithdrawalRequest } from 'src/users/schema/userWithDrawal.schema';

import { Control } from './schema/control.schema';
import { UserTimeStamp } from 'src/users/schema/userlog.schema';
import { Otp } from 'src/users/schema/otp.schema';
import { SendEmail } from 'src/helpers/SendEmail.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private adminModel: Model<Admin>,
    @InjectModel('WithdrawalRequest')
    private WithdrawalRequestModel: Model<WithdrawalRequest>,
    @InjectModel('User') private userModel: PaginateModel<User>,
    @InjectModel('Notification')
    private notificationModel: PaginateModel<Notification>,
    private loggingService: LoggingService,
    @InjectModel('Control') private controlModel: Model<Control>,
    @InjectModel('UserTimeStamp')
    private userTimeStampModel: Model<UserTimeStamp>,
    @InjectModel('Otp') private otpModel: Model<Otp>,

    private jwtService: JwtService,
  ) {}

  async getPendingWithdrawalRequest(userId) {
    try {
      const admin = await this.adminModel.findById(userId);
      if (!admin) {
        return {
          success: false,
          message: 'Authorization Failed',
        };
      }

      //   const withdrawalRequest = await this.WithdrawalRequestModel.find().populate({
      //     path: 'userId',
      //     select: 'email',
      //     match: { paymentMethod: { $in: ['paypal', 'amazon_gift_card'] } },
      //   })

      //  const c  = await this.WithdrawalRequestModel.find({ paymentMethod: 'bank_account' }).populate('userId', 'bankAccount');

      //  const d = await this.WithdrawalRequestModel.find({ paymentMethod: 'cryptocurrency' }).populate('userId', 'cryptoWallet');

      const withdrawalRequest =
        await this.WithdrawalRequestModel.find().populate({
          // Populate the `user` field with the user document.
          path: 'userId',
          select: 'email', // Select the `email` field from the user document.
        });

      console.log(withdrawalRequest, '...withdrawalRequest....');
      return {
        success: true,
        message: 'Succesfully retrieved withdrawal request ',
        data: withdrawalRequest,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retieve ',
      };
    }
  }

  async approvePendingWithdrawalRequest(body, userId) {
    const { transactionId } = body;

    try {
      const admin = await this.adminModel.findById(userId);
      if (!admin) {
        return {
          success: false,
          message: 'Authorization Failed',
        };
      }

        await this.WithdrawalRequestModel.findByIdAndUpdate(
          transactionId,
          { status: 'approved' },
          { new: true },
        );

      return {
        success: true,
        message: 'Successfully aproved',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to approv',
      };
    }
  }
  async getUserLogs() {
    const data = await this.loggingService.getLogs();

    try {
      return {
        data,
        success: true,
        message: 'User Logs retrieved',
      };
    } catch (error) {}
  }
  /////////////Login//////////////
  async login(loginAdminDto: LoginAdminDto) {
    try {
      if (!loginAdminDto.email) {
        return {
          success: false,
          message: 'Email or username is required for login',
        };
      }
      const admin = await this.adminModel.findOne({
        $or: [
          { email: loginAdminDto.email },
          { username: loginAdminDto.email },
        ],
      });
      if (!admin) {
        return {
          success: false,
          message: 'Access denied',
        };
      }
      const isMatch = await bcrypt.compare(
        loginAdminDto.password,
        admin.password,
      );
      if (!isMatch) {
        return {
          success: false,
          message: 'Email or password does not match',
        };
      }
      const payload = {
        id: admin.id,
        user_type: 'admin',
      };
      const token = await this.jwtService.sign(payload, {
        secret: ENV.JWT_SECRET_KEY,
        expiresIn: '30days',
      });
      return {
        success: true,
        message: 'Admin login successfully',
        token: token,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async resetPassword(email) {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email  is required.',
        };
      }
      const admin = await this.adminModel.findOne({
        $or: [{ email: email }],
      });
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
        };
      }
      const otpData = await this.otpModel.findOneAndDelete({
        email: email?.toLowerCase(),
      });

      const otp = Math.floor(1000 + Math.random() * 9000);
      SendEmail({
        type: 'verification-signup',
        code: otp,
        title: '',
        email: email?.toLowerCase(),
      });
      const newOtp = await new this.otpModel({
        email: email?.toLowerCase(),
        otp: otp,
      });
      await newOtp.save();
      return {
        success: true,
        message: 'Otp sent',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Admin not found',
      };
    }
  }
  async otpVerify(email, otp) {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email or username is required for login',
        };
      }
      const admin = await this.adminModel.findOne({
        $or: [{ email: email }],
      });
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
        };
      }
      const isMatch = await this.otpModel.findOne({
        email: email?.toLowerCase(),
        otp: otp,
      });
      if (!isMatch) {
        return {
          success: false,
          message: 'Email or Otp does not match',
        };
      }
      const payload = {
        id: admin.id,
        user_type: 'admin',
      };
      const token = await this.jwtService.sign(payload, {
        secret: ENV.JWT_SECRET_KEY,
        expiresIn: '30days',
      });
      return {
        success: true,
        message: 'Token Verify Successfully',
        token: token,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  /////////////////////Get Users List////////
  async getUsers(userId, page = 1, limit = 10, search, body) {
    try {
      const admin = await this.adminModel.findById(userId);
      if (!admin) {
        return {
          success: false,
          message: 'Authorization Failed',
        };
      }
      const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { ...body.option },
      };

      const users = await this.userModel.paginate(
        {
          $or: [
            // {
            //   firstName: { '$regex': `.*${search}.*`, '$options': 'i' }
            // },
            // {
            //   lastName: { '$regex': `.*${search}.*`, '$options': 'i' }
            // },
            {
              email: { $regex: `.*${search}.*`, $options: 'i' },
            },
            {
              username: { $regex: `.*${search}.*`, $options: 'i' },
            },
            {
              phone: { $regex: `.*${search}.*`, $options: 'i' },
            },
          ],
          ...body.filter,
        },
        options,
      );
      return {
        success: true,
        users: users,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  async downloadUsers(userId, search, body) {
    try {
      const admin = await this.adminModel.findById(userId);
      if (!admin) {
        return {
          success: false,
          message: 'Admin not found',
        };
      }
      const users = await this.userModel
        .find({
          $or: [
            // {
            //   firstName: { '$regex': `.*${search}.*`, '$options': 'i' }
            // },
            // {
            //   lastName: { '$regex': `.*${search}.*`, '$options': 'i' }
            // },
            {
              email: { $regex: `.*${search}.*`, $options: 'i' },
            },
            {
              username: { $regex: `.*${search}.*`, $options: 'i' },
            },
            {
              phone: { $regex: `.*${search}.*`, $options: 'i' },
            },
          ],
          ...body.filter,
        })
        .sort({ ...body.option });
      return {
        success: true,
        message: 'User Find Successfully',
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  async createUser(body) {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { email: body.email },
          // { phone: createUserDto.phone },
        ],
      });

      if (user) {
        return {
          success: false,
          message: 'Email already registerd',
        };
      }

      if (body.password !== body.confirmPassword) {
        return {
          success: false,
          message: 'Password and confirm password does not match',
        };
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);

      body.password = hashedPassword;
      body.email = body.email.trim();
      body.firstName = body.firstName.trim();
      body.lastName = body.lastName.trim();

      const today = new Date();

      const control = await this.controlModel.findOne({});

      const newUser = await new this.userModel({ ...body }).save();

      return {
        success: true,
        message: 'User created successfully.',
        user: newUser,
      };
    } catch (err) {
      if (err.keyPattern.phone) {
        return {
          success: false,
          message: `Sorry, this ${Object.keys(err.keyValue)[0]} already exists`,
        };
      }
      if (err.keyPattern.username) {
        return {
          success: false,
          message: `${Object.keys(err.keyValue)[0]} already registered`,
        };
      }

      return {
        success: false,
        message: err.message,
      };
    }
  }
  ////////////////////Get User By Id///////////////
  async getUserById(userId: string) {
    try {
      if (!userId) {
        return {
          success: false,
          message: 'UserId is required to get user details',
        };
      }

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not exists',
        };
      } else {
        return {
          success: true,
          user: user,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  async changePassword(id, input) {
    try {
      const user = await this.adminModel.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'Admin not exists',
        };
      }

      const isMatch = await bcrypt.compare(input.oldPassword, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: 'Password does not match',
        };
      }
      if (input.oldPassword === input.newPassword) {
        return {
          success: false,
          message: 'Password already used, please enter a new password',
        };
      }
      if (input.newPassword !== input.confirmNewPassword) {
        return {
          success: false,
          message: 'New password and confirm new password does not match',
        };
      }
      const hashedPassword = await bcrypt.hash(input.newPassword, 10);
      const updateUser = await this.adminModel.findOneAndUpdate(
        { email: user.email },
        { $set: { password: hashedPassword } },
        { new: true },
      );
      return {
        success: true,
        message: 'Password change successfully',
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  async blockUserById(userId: string) {
    try {
      if (!userId) {
        return {
          success: false,
          message: 'UserId is required',
        };
      }

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not exists',
        };
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { block: true },
        { new: true },
      );
      return {
        success: true,
        message: 'User Blocked successfully',
        user: updatedUser,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  async unblockUserById(userId: string) {
    try {
      if (!userId) {
        return {
          success: false,
          message: 'UserId is required',
        };
      }

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not exists',
        };
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { block: false },
        { new: true },
      );
      return {
        success: true,
        message: 'User Unblocked successfully',
        user: updatedUser,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  ////////////Update User////////////
  async updateUserById(
    userId: string,

    updateUserDto: UpdateUserDto,
  ) {
    try {
      if (!userId) {
        return {
          success: false,
          message: 'UserId is required',
        };
      }

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not exists',
        };
      }
      if (updateUserDto.firstName === '') {
        updateUserDto.firstName = user.firstName;
      }
      if (updateUserDto.lastName === '') {
        updateUserDto.lastName = user.lastName;
      }
      if (updateUserDto.email === '') {
        updateUserDto.email = user.email;
      }
      if (updateUserDto.username === '') {
        updateUserDto.username = user.username;
      }
      if (updateUserDto.phone === '') {
        updateUserDto.phone = user.phone;
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        { new: true },
      );
      return {
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  ////////////////User Search//////////
  async userSearch(page = 1, limit = 10, name: string) {
    try {
      if (!name) {
        return {
          success: false,
          return: 'Name field is required',
        };
      }
      const options = {
        select: '-__v -password -createdAt -updatedAt',
        page: Number(page),
        limit: Number(limit),
      };
      const users = await this.userModel.paginate(
        { fullName: { $regex: new RegExp(name) } },
        options,
      );
      return {
        success: true,
        users: users,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  /////////////////////Delete User///////////
  async deleteUserById(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(id);

      if (!user) {
        return {
          success: false,
          message: 'User not exists',
        };
      }
      return {
        success: true,
        message: 'User is successfully deleted',
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
