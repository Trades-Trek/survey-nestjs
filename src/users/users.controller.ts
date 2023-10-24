/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  Patch,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Delete,
  Query,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordResetDto } from './dto/forgot-password-input.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyEmailDto } from './dto/otp-user.dto';

import { Express, Request } from 'express';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';

import { editFileName, imageFileFilter } from 'src/helpers/ImageUpload';
import { AuthUser } from './middleware/auth.decorator';
import { HttpService } from '@nestjs/axios';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('signup')
  @HttpCode(200)
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signUpBakup(createUserDto);
  }
  @Post('update-user')
  @HttpCode(200)
  async updateUser(@Body() body, @AuthUser('id') id: string) {
    return await this.userService.updateUser(id, body);
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }


  @Post('withdrawalRequest')
  @HttpCode(200)
  async WithdrawalRequest(  @AuthUser() id: string, @Body() body) {
    return await this.userService.WithdrawalRequest(id,  body);
  }

  @Post('resendOtp')
  @HttpCode(200)
  async generateOtp(@Body('email') email: string) {
    return await this.userService.resendOtp(email);
  }
  @Post('verifyEmail')
  @HttpCode(200)
  async verifyEmailAndUpdateStatus(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.userService.verifyEmailAndUpdateStatus(verifyEmailDto);
  }

  @Post('forgotPasswordSendOtp')
  @HttpCode(200)
  async forgotPasswordSendOtp(@Body('email') email: string) {
    return await this.userService.forgotPasswordSendOtp(email);
  }
  @Patch('resetPassword')
  @HttpCode(200)
  async resetPassword(@Body() input: ForgotPasswordResetDto) {
    return await this.userService.resetPassword(input);
  }
  @Patch('changePassword')
  @HttpCode(200)
  async changePasswordAfterLogin(
    @Body() input: ChangePasswordDto,
    @AuthUser() id: string,
  ) {
    try {
      return await this.userService.changePasswordAfterLogin(input, id);
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

 
  @Delete('remove-pic')
  async removePic(@AuthUser('id') id: string) {
    return await this.userService.removePic(id);
  }

  @Delete('delete-account/:id')
  @HttpCode(200)
  async deleteUser(@Param('id') id: string, @AuthUser() authUserId: string) {
    if (authUserId !== id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this account.',
      );
    }
    return await this.userService.deleteUserAccount(id);
  }

  @Get('get/info')
  async userInfo(
    @AuthUser('id') id: string  ) {
    return await this.userService.userInfo(id);
  }
  @Get('timestamp')
  async updateTimeStamp(@AuthUser('id') id: string) {
    return await this.userService.updateTimeStamp(id);
  }

  @Get('allow-notification-status')
  async allowNotificationStatus(
    @AuthUser('id') id: string,
    @Query('allowNotification') allowNotification: boolean,
  ) {
    return await this.userService.allowNotificationStatus(
      id,
      allowNotification,
    );
  }

}
