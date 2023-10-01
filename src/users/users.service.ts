/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import app from '../../config/firebase.config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Otp } from './schema/otp.schema';
import { VerifyEmailDto } from './dto/otp-user.dto';
import { Cron } from '@nestjs/schedule';
import { ForgotPasswordResetDto } from './dto/forgot-password-input.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ENV } from 'config/environment';
import { UserProfile } from './schema/userProfile.schema';
import { Request } from 'express';
import {
  SendEmail,
  subscriptionRemainder,
  successfulSignupMessage,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from 'src/helpers/SendEmail.service';
import {
  NegerianGetDate,
  NegerianGetDay,
  NegerianTimeZone,
  subscriptionSubscribe,
  timeDiffCalc,
  userSignupMessage,
  verifyEmailMessage,
} from '../helpers/NegerianTimeZone';
import * as PaginateModel from 'mongoose-paginate';
import { updateSubscriptionDto } from './dto/update-subscription';
import { BankAccount } from '../bank/schema/bank.schema';
import { NegerianDateZone } from 'src/helpers/NegerianTimeZone';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserRefferal } from 'src/userrefferal/schema/userrefferal.schema';
import { Control } from 'src/admin/schema/control.schema';
import { InvoiceIncrement, UserIdIncrement } from 'src/helpers/Increment';

import { UserTimeStamp } from './schema/userlog.schema';

const fs = require('fs');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserTimeStamp')
    private userTimeStampModel: Model<UserTimeStamp>,
    @InjectModel('BankAccount') private bankAccountModel: Model<BankAccount>,
    @InjectModel('Otp') private otpModel: Model<Otp>,
    @InjectModel('UserProfile') private userProfileModel: Model<UserProfile>,
    @InjectModel('Notification')
    private notificationModel: PaginateModel<Notification>,
    @InjectModel('UserRefferal')
    private userrefferalModel: PaginateModel<UserRefferal>,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @InjectModel('Control') private controlModel: Model<Control>,
  ) {}

  @Cron('*/15 * * * * *')
  EVERY_FIFTEEN_MINTUES_DELETE_OTP() {
    this.deleteOtpAfterFifteenMinutes();
  }
  @Cron('0 0 * * * *')
  EVERY_Day_midnight() {
    this.deleteUserlogs();
  }

  async userInfo(id: string) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(
          id,
          { lastSeen: new Date() },
          { $new: true },
        )
        .select('-password');

      let today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      if (!user) {
        return {
          success: false,
          message: 'User does not exists',
        };
      }

      const userBankDetails = await this.bankAccountModel.find({
        userId: id
      })
      
      return {
        success: true,
        data: { user, userBankDetails: userBankDetails.length ? userBankDetails : null   },
      };

    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async deleteUserlogs() {
    await this.userTimeStampModel.deleteMany({});
  }
  async remainderEmail() {
    const user = await this.userModel.find({});
    var today = new Date();
    today.setHours(23, 59, 59, 999);
    user.map((item) => {
      if (
        timeDiffCalc(item.expiredDate, today) == 1 ||
        timeDiffCalc(item.expiredDate, today) == 2
      ) {
        subscriptionRemainder(item.email, item.expiredDate);
      }
    });
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { email: createUserDto.email },
          // { phone: createUserDto.phone },
        ],
      });
      if (user) {
        return {
          success: false,
          message: 'Email already registerd',
        };
      }

      // if (createUserDto.password !== createUserDto.confirmPassword) {
      //   return {
      //     success: false,
      //     message: 'Password and confirm password does not match',
      //   };
      // }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;
      createUserDto.email = createUserDto.email.trim();
      createUserDto.name = createUserDto.name.trim();

      const newUser = await this.userModel.create({ ...createUserDto });
      const otp = Math.floor(1000 + Math.random() * 9000);
      await new this.otpModel({ email: newUser.email, otp: otp }).save();
      SendEmail({
        type: 'verification-signup',
        code: otp,
        title: user.username,
        email: createUserDto.email,
      });

      // userSignupMessage(newUser.username)
      // await this.
      await this.notificationModel.create({
        userId: newUser._id,
        type: 'Success',
        username: newUser.username,
        message: userSignupMessage(),
      });

      return {
        success: true,
        message: 'User created successfully and otp sent',
        user: newUser,
      };
    } catch (err) {
      if (err.keyPattern.username) {
        return {
          success: false,
          message: `Sorry, this ${Object.keys(err.keyValue)[0]} already exists`,
        };
      }

      return {
        success: false,
        message: err.message,
      };
    }
  }

  async updateUser(id, data) {
    try {
      const prevUser = await this.userModel.findByIdAndUpdate(id);

      await this.userModel.findByIdAndUpdate(id, data);

      await this.handleLogging(prevUser, data);

      return {
        success: true,
        message: 'Account Updated Successfully.',
      };
    } catch (error) {
      if (error.keyPattern.phone) {
        return {
          success: false,
          message: `Sorry, this ${
            Object.keys(error.keyValue)[0]
          } number already exists`,
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }
  }

  private async handleLogging(prevUser, data) {
    if (
      prevUser.firstName !== data.firstName ||
      prevUser.lastName !== data.lastName
    ) {
      this.eventEmitter.emit('logs', {
        userId: prevUser.id,
        username: prevUser.username,
        appFeature: 'Profile',
        userAction: 'update name',
        status: 'Success',
      });
    }
  }

  async signUpBakup(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.refferalCode != '') {
        const ref = await this.userrefferalModel.findOne({
          refferalCode: createUserDto.refferalCode,
        });
        if (!ref) {
          return {
            success: false,
            message: 'Refferal code is not valid',
          };
        }
      }

      const user = await this.userModel.findOne({
        $or: [{ email: createUserDto.email?.toLowerCase() }],
      });

      if (user) {
        return {
          success: false,
          message: 'Email already registerd',
        };
      }

      // if (createUserDto.password !== createUserDto.confirmPassword) {
      //   return {
      //     success: false,
      //     message: 'Password and confirm password does not match',
      //   };
      // }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;
      createUserDto.email = createUserDto.email.trim();
      createUserDto.name = createUserDto.name.trim();

      const joinDate = new Date();
      joinDate.setUTCHours(0, 0, 0, 0);

      const reffer = await this.userrefferalModel.findOne({
        email: createUserDto.email.toLowerCase(),
        refferalCode: createUserDto.refferalCode,
      });

      let refferalCode = '';
      if (reffer) {
        await this.userrefferalModel.findOneAndUpdate(
          {
            email: createUserDto.email.toLowerCase(),
            refferalCode: createUserDto.refferalCode,
          },
          {
            $set: {
              joined: true,
            },
          },
        );
        refferalCode = createUserDto.refferalCode;
      } else if (createUserDto.refferalCode != '') {
        const refUser = await this.userrefferalModel.findOne({
          refferalCode: createUserDto.refferalCode,
        });
        await this.userrefferalModel.create({
          email: createUserDto.email.toLowerCase(),
          refferalCode: createUserDto.refferalCode,
          userId: refUser.userId,
          joined: true,
        });
      }
      delete createUserDto.refferalCode;

      const newUser = await new this.userModel({
        ...createUserDto,
        email: createUserDto.email.toLowerCase(),
        username: createUserDto.username.toLowerCase(),
        joinedRefferal: refferalCode,
        yourRefferal: `${createUserDto.username}${Math.floor(
          10 + Math.random() * 90,
        )}`,
      }).save();

      const otp = Math.floor(1000 + Math.random() * 9000);

      await new this.otpModel({
        email: newUser.email.toLowerCase(),
        otp: otp,
      }).save();
      const emailDetails = {
        type: 'verification-signup',
        code: otp,
        title: `${createUserDto.name}`,
        email: newUser.email.toLowerCase(),
      };

      SendEmail(emailDetails);

      const cloneNewUser = { ...newUser };
      delete cloneNewUser.password;

      return {
        success: true,
        message: `Signup successful `,
        user: cloneNewUser,
      };
    } catch (err) {
      if (err?.keyPattern?.username) {
        return {
          success: false,
          message: `${capitalizeFirstLetter(
            Object.keys(err.keyValue)[0],
          )}already registered`,
        };
      }

      return {
        success: false,
        message: err.message,
      };
    }
  }
  ////////////Login ///////////////////////////
  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { email: loginUserDto.email?.toLowerCase() },
          { username: loginUserDto.email?.toLowerCase() },
        ],
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid email/username or password',
          user: null,
        };
      }

      if (!loginUserDto.password) {
        return {
          success: false,
          message: 'Password is required',
          user: null,
        };
      }

      const isMatch = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid email/username or password',
        };
      }
      if (user.block) {
        return {
          success: false,
          message: 'You are blocked by Admin',
        };
      }

      if (user.status === 0) {
        await this.otpModel.findOneAndDelete({
          email: user.email?.toLowerCase(),
        });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const newOtp = await new this.otpModel({
          email: user.email?.toLowerCase(),
          otp: otp,
        });
        await newOtp.save();

        return {
          success: false,
          message: 'Please verify email address first',
          email: user.email,
          profileStatus: 0,
          user: await this.userModel
            .findOne({ email: user.email })
            .select('-password'),
        };
      }
   
      const payload = {
        id: user.id,
        user_type: 'user',
      };
      const token = await this.jwtService.sign(payload, {
        secret: ENV.JWT_SECRET_KEY,
      });

      const userBankDetails = await this.bankAccountModel.find({
        userId: user.id
      })
      
      return {
        success: true,
        message: 'User login successfully',
        user: await this.userModel
          .findOne({ email: user.email })
          .select('-password'),
        token: token,
        userBankDetails: userBankDetails.length ? userBankDetails : null 
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  //////// Resend Otp /////////
  async resendOtp(email: string) {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email is required',
        };
      }
      const user = await this.userModel.findOne({
        email: email?.toLowerCase(),
      });
      if (!user) {
        return {
          success: false,
          message: 'User does not exists',
        };
      }
      const otpData = await this.otpModel.findOne({ email: user.email });
      if (!otpData) {
        const otp = Math.floor(1000 + Math.random() * 9000);

        SendEmail({
          type: 'verification-signup',
          code: otp,
          title: user.username,
          email,
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
      }
      const t1 = new Date().getTime();
      const otpTime = otpData.createdAt.getTime();
      const timeDiff = t1 - otpTime;

      if (timeDiff < 1000) {
        return {
          success: false,
          message: 'Too many request,please wait',
        };
      } else {
        await this.otpModel.findOneAndDelete({ email: email?.toLowerCase() });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const newOtp = await new this.otpModel({
          email: email.toLowerCase(),
          otp: otp,
        });

        SendEmail({
          type: 'verification-signup',
          code: otp,
          title: user.username,
          email,
        });
        await newOtp.save();
        return {
          success: true,
          message: 'Otp sent',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  // subscription update ...... \
  async subscriptionUpdateStatus(subscription: updateSubscriptionDto) {
    try {
      const data = await this.userModel.findOne({ email: subscription.email });

      if (!data) {
        return {
          success: false,
          message: 'User does not exists',
        };
      }

      const today = new Date();
      const joinDate = new Date();
      joinDate.setUTCHours(0, 0, 0, 0);

      const newUser = await this.userModel.findOneAndUpdate(
        { email: subscription.email },
        { $set: { expiredDate: today } },
      );

      await this.notificationModel.create({
        userId: newUser._id,
        type: 'Success',
        username: newUser.username,
        message: subscriptionSubscribe(newUser.username, 'Basic'),
      });

      const payload = {
        id: newUser.id,
        user_type: 'user',
      };
      const token = await this.jwtService.sign(payload, {
        secret: ENV.JWT_SECRET_KEY,
      });

      return {
        success: true,
        message: 'Subscription Added Successfully',
        user: await this.userModel
          .findOne({ email: newUser.email })
          .select('-password'),
        token: token,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  //////////Verify Email with Otp///////
  async verifyEmailAndUpdateStatus(verifyEmailDto: VerifyEmailDto) {
    try {
      const userOtp = await this.otpModel.findOne({
        email: verifyEmailDto.email?.toLowerCase(),
      });
      if (!userOtp) {
        return {
          success: false,
          message: 'User otp  not found',
        };
      }
      const user = await this.userModel.findOne({
        email: userOtp.email?.toLowerCase(),
      });
      if (!user) {
        return {
          success: false,
          message: 'User does not exists',
        };
      }
      if (userOtp.otp == verifyEmailDto.otp) {
        const updateStatus = await this.userModel.findOneAndUpdate(
          { email: userOtp.email?.toLowerCase() },
          { $set: { status: 1 } },
          { new: true },
        );
        if (updateStatus) {
          await this.otpModel.findOneAndDelete({
            email: verifyEmailDto.email?.toLowerCase(),
          });
        }

        await this.notificationModel.create({
          userId: user._id,
          type: 'Success',
          username: user.username,
          message: verifyEmailMessage(),
        });

        //@ts-ignore
        const { name } = user;

        const emailDetails = {
          email: verifyEmailDto.email?.toLowerCase(),
          title: `${name}`,
          type: 'signup',
        };
        successfulSignupMessage(emailDetails);
        const payload = {
          id: user.id,
          user_type: 'user',
        };
        const token = await this.jwtService.sign(payload, {
          secret: ENV.JWT_SECRET_KEY,
        });

        return {
          success: true,
          message: 'Email verified',
          user: await this.userModel
            .findOne({ email: verifyEmailDto.email?.toLowerCase() })
            .select('-password'),
          token: token,
        };
      } else {
        return {
          success: false,
          message: 'Whoops! You have entered an incorrect OTP',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  ///////////ForgotPassword Send Otp////////
  async forgotPasswordSendOtp(email: string) {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email is required',
        };
      }
      const user = await this.userModel.findOne({
        email: email?.toLowerCase(),
      });
      if (!user) {
        return {
          success: true,
          message: 'Otp sent',
        };
      }

      const otpData = await this.otpModel.findOne({ email: user.email });
      if (!otpData) {
        const otp = Math.floor(1000 + Math.random() * 9000);

        const newOtp = await new this.otpModel({
          email: email?.toLowerCase(),
          otp: otp,
        });
        await newOtp.save();

        const emailDetails = {
          type: 'password-reset',
          code: otp,
          title: user.username,
          email,
        };
        sendPasswordResetEmail(emailDetails);

        return {
          success: true,
          message: 'Otp sent',
        };
      }
      const t1 = new Date().getTime();
      const otpTime = otpData.createdAt.getTime();
      const timeDiff = t1 - otpTime;

      if (timeDiff < 1000) {
        return {
          success: false,
          message: 'Too many request,please wait',
        };
      } else {
        await this.otpModel.findOneAndDelete({ email: email?.toLowerCase() });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const newOtp = await new this.otpModel({
          email: email.toLowerCase(),
          otp,
        });

        await newOtp.save();
        const emailDetails = {
          type: 'password-reset',
          code: otp,
          title: user.username,
          email,
        };
        sendPasswordResetEmail(emailDetails);

        return {
          success: true,
          message: 'Otp sent',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  //////////////////Reset Password////////
  async resetPassword(input: ForgotPasswordResetDto) {
    try {
      const user = await this.userModel.findOne({ email: input.email });
      if (!user) {
        return {
          success: false,
          message: 'Email is not registered',
        };
      }
      const otpData = await this.otpModel.findOne({ email: user.email });
      if (!otpData) {
        return {
          success: false,
          message: 'Otp not found',
        };
      }
      if (input.newPassword !== input.confirmNewPassword) {
        return {
          success: false,
          message: 'New password and confirm new password does not match',
        };
      }
      if (otpData.otp !== input.otp) {
        return {
          success: false,
          message: 'Otp does not match',
        };
      } else {
        const hashedPassword = await bcrypt.hash(input.newPassword, 10);
        const updatedData = await this.userModel.findOneAndUpdate(
          { email: input.email },
          { $set: { password: hashedPassword } },
          { new: true },
        );
        await updatedData.save();

        const emailDetails = {
          type: 'password-reset-success',
          title: user.username,
          email: user.email,
        };
        sendPasswordResetSuccessEmail(emailDetails);
        this.eventEmitter.emit('logs', {
          userId: user.id,
          username: user.username,
          appFeature: 'Authentication',
          userAction: 'password reset',
          status: 'Success',
        });
        return {
          success: true,
          message: 'User password reset successfully',
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  ///////////Change Password//////////
  async changePasswordAfterLogin(input: ChangePasswordDto, id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User does not exists',
        };
      }

      const isMatch = await bcrypt.compare(input.oldPassword, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: 'Old Password Is Incorrect',
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
      const updateUser = await this.userModel.findOneAndUpdate(
        { email: user.email },
        { $set: { password: hashedPassword } },
        { new: true },
      );
      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  //////////User upload profile iMAG/////////
  async uploadProfileImage(
    file: Express.Multer.File,
    id: string,
    req: Request,
  ) {
    const storage = getStorage(app);

    try {
      // @ts-ignore
      const storageRef = ref(storage, file.originalname);
      const snapshot = await uploadBytes(storageRef, file.buffer);
      const url = await getDownloadURL(snapshot.ref);

      if (!file) {
        return {
          success: false,
          message: 'Image not provided',
        };
      }

      const user = await this.userModel.findByIdAndUpdate(id, {
        profilePic: url,
      });

      this.eventEmitter.emit('logs', {
        userId: user.id,
        username: user.username,
        appFeature: 'Profile',
        userAction: 'update profle pic',
        status: 'Success',
      });

      return {
        success: true,
        message: 'Profile Pic Updated',
        // @ts-ignore
        profilePic: url,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  async removePic(id: string) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, {
        baseUrl: null,
        filePath: null,
      });

      return {
        success: true,
        message: 'Profile pic removed.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  async updateTimeStamp(id: string) {
    return await this.userTimeStampModel.create({ userId: id });
  }


  async deleteOtpAfterFifteenMinutes() {
    const otps = await this.otpModel.find();
    if (otps.length == 0) {
      return;
    }
    const t1 = new Date().getTime();
    for (let otp of otps) {
      const otpTime = otp.createdAt.getTime();
      const timeDiff = t1 - otpTime;
      if (timeDiff > 1000 * 900) {
        await this.otpModel.findByIdAndDelete(otp.id);
      }
    }
  }

  // allow notification status
  async allowNotificationStatus(id: string, allowNotification: boolean) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found!',
        };
      }
      await this.userModel.findByIdAndUpdate(id, {
        allowNotification: allowNotification,
      });
      return {
        success: true,
        message: 'Status Updated Successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // await this.otpModel.findOneAndDelete({ email: email?.toLowerCase() });

  async deleteUserAccount(id) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      await this.userModel.findByIdAndDelete(id);

      return {
        success: true,
        message: 'User account deleted successfully',
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
