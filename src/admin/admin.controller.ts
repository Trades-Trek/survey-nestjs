/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { AuthUser } from 'src/users/middleware/auth.decorator';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { AuthAdmin } from './middleware/auth.decorator';
import { Admin } from './schema/admin.schema';
@Controller('admin-nat-sur')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
  @Get('logs')
  @HttpCode(200)
  async getUserLogs() {
    return await this.adminService.getUserLogs();
  }


  @Get('pendingWithdrawalRequest')
  @HttpCode(200)
  async getPendingWithdrawalRequest(
    @AuthAdmin('userId') userId: string,
  ) {
    return await this.adminService.getPendingWithdrawalRequest(userId);
  }


  @Post('login')
  @HttpCode(200)
  async login(@Body() loginAdminDto: LoginAdminDto) {
    return await this.adminService.login(loginAdminDto);
  }

  @Get('resetPassword')
  @HttpCode(200)
  async resetPassword(@Query('email') email:string) {
    return await this.adminService.resetPassword(email);
  }
  @Get('otp-verify')
  @HttpCode(200)
  async otpVerify(@Query('email') email:string,@Query('otp') otp:number) {
    return await this.adminService.otpVerify(email,otp);
  }
  @Post('users/getAll')
  async getUsers(@Body() body, @AuthAdmin('userId') userId: string, @Query('page') page: number, @Query('limit') limit: number,@Query('search') search:string) {
    return await this.adminService.getUsers(userId,page, limit,search,body);
  }
  @Post('users/download')
  async downloadUsers(@Body() body, @AuthAdmin('userId') userId: string,@Query('search') search:string) {
    return await this.adminService.downloadUsers(userId,search,body);
  }
  @Post('users')
  async createUser(@Body() body) {
    return await this.adminService.createUser(body);
  }
  @Patch('change-password')
  async changePassword(@AuthAdmin('userId') userId: string, @Body() body) {
    return await this.adminService.changePassword(userId, body);
  }
  @Get('user/:id')
  async getUserById(@Param('id') userId: string) {
    return await this.adminService.getUserById(userId);
  }
  @Put('user/block/:id')
  async blockUserById(@Param('id') userId:string){
    return await this.adminService.blockUserById(userId);

  }
  @Put('user/unblock/:id')
  async unblockUserById(@Param('id') userId:string){
    return await this.adminService.unblockUserById(userId)
  }

  @Put('user/:id')
  async updateUserById(
    @Param('id') userId: string,

    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.adminService.updateUserById(
      userId,

      updateUserDto,
    );
  }

  @Get('users/search')
  async userSearch(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('name') name: string,
  ) {
    return await this.adminService.userSearch(page, limit, name);
  }
  @Delete('user/:id')
  async deleteUserById(@Param('id') id: string) {
    return await this.adminService.deleteUserById(id);
  }








}
