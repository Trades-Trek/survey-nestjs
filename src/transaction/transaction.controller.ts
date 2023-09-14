import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AuthAdmin } from 'src/admin/middleware/auth.decorator';
import { AuthUser } from 'src/users/middleware/auth.decorator';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
          constructor(private transactionService: TransactionService) { }
          @Post('')
          async addTransaction(@AuthUser('userId') userId: string,@Body() body) {
                    return await this.transactionService.addTransaction(userId, body)
          }
          @Get('')
          async getUserTransaction(@AuthUser('userId') userId: string) {
                    return await this.transactionService.getUserTransaction(userId)
          }
          @Post('sss')
          async getUsersssTransaction(@AuthUser('userId') userId: string,@Body() data) {
                    return await this.transactionService.getUserTransaction(userId)
          }
          @Post('admin/all')
          async getAdminTransaction(@AuthAdmin('userId') userId: string,@Query('page') page:number,@Query('search') search:string,@Body() body) {
                 
                    return await this.transactionService.getAdminTransaction(userId,page,search,body)
          }
          @Post('admin/all-download')
          async downloadTransaction(@AuthAdmin('userId') userId: string,@Query('search') search:string,@Body() body) {
               
                    return await this.transactionService.downloadTransaction(userId,search,body)
          }
          @Put('admin')
          async updateAdminTransaction(@AuthAdmin('userId') userId: string,@Body() body) {
                    return await this.transactionService.updateAdminTransaction(userId,body)
          }
          @Get('bank-details')
          async getBankDetail(@AuthUser('userId') userId: string) {
                    return await this.transactionService.getBankDetail(userId)
          }
          @Post('admin/all-bank-details')
          async getAllBankDetail(@AuthAdmin('userId') userId: string,@Query('page') page:number,@Query('search') search:string,@Body() body) {
                    return await this.transactionService.getAllBankDetail(userId,page,search,body)
          }
          @Post('admin/all-bank-details-download')
          async downloadBankDetails(@AuthAdmin('userId') userId: string,@Query('search') search:string,@Body() body) {
               
                    return await this.transactionService.downloadBankDetails(userId,search,body)
          }

}
