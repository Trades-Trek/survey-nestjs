import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthAdmin } from 'src/admin/middleware/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/users/middleware/auth.decorator';
import { SupportService } from './support.service';
import { Express, Request } from 'express';


@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) { }
  @Post('')
  async createSupport(@AuthUser('userId') userId: string, @Body() body) {
    return await this.supportService.createSupport(userId, body)
  }

  @Post('withImage')
  @UseInterceptors(FileInterceptor('image')) 
  async createSupportWithImage(@AuthUser('userId') userId: string, @Body() body, @UploadedFile() imageFile: Express.Multer.File,) {
    return await this.supportService.createSupportWithImage(userId, body, imageFile)
  }

  @Post('all')
  async AllSupport(@AuthAdmin('userId') userId:string,@Body() body,@Query('search') search:string,@Query('page') page){
  return await this.supportService.allSupport(userId, page , search , body)
  }
  @Post('all-download')
  async AllSupportDownload(@AuthAdmin('userId') userId:string,@Body() body,@Query('search') search:string){
  return await this.supportService.allSupportDownload(userId, search , body)
  }

}
