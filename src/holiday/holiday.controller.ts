import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AuthAdmin } from 'src/admin/middleware/auth.decorator';
import { HolidayService } from './holiday.service';

@Controller('holiday')
export class HolidayController {
          constructor(private readonly holidayService: HolidayService) {}

          @Post()
          async createHoliday(@Body() body) {
                 
            return await this.holidayService.createHoliday(body);
          }
          @Get()
          async getAllHoliday() {
                 
                 
            return await this.holidayService.getAllHoliday();
          }
          @Put()
          async UpdateHoliday(@Body() body) {
                 
                 
            return await this.holidayService.updateHoliday(body);
          }
          @Delete(':id')
          async deleteHoliday(@Param() id:string) {
                 
                 
            return await this.holidayService.deleteHoliday(id);
          }

          @Post('all/holiday')
          async getAllAdminHoliday(@AuthAdmin('userId') userId: string,@Body() body ,@Query('page') page:number,@Query('search') search) {
                 
                 
            return await this.holidayService.getAllAdminHoliday(userId,body,page,search);
          }
          @Post('all/holiday-download')
          async downloadAllHoliday(@AuthAdmin('userId') userId: string,@Body() body ,@Query('search') search) {
                 
                 
            return await this.holidayService.downloadAllHoliday(userId,body,search);
          }


}
