import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthAdmin } from 'src/admin/middleware/auth.decorator';
import { AuthUser } from 'src/users/middleware/auth.decorator';
import { UserrefferalService } from './userrefferal.service';

@Controller('userrefferal')
export class UserrefferalController {
          constructor(private userrefferalService: UserrefferalService) { }
          @Get('')
          async refferalInfo( @AuthUser('userId') userId: string){

                    return await this.userrefferalService.refferalInfo(userId)
          }
          @Post('')
          async sendRefferal(@Body() Body, @AuthUser('userId') userId: string,){
                    return await this.userrefferalService.sendRefferal(userId,Body)
          }
          @Post('admin-list')
          async adminList(   @AuthAdmin('userId') userId:string,@Query('search') search:string,@Query('page') page:number,@Body() Body){
                
                    return await this.userrefferalService.adminRefferalList(userId,search,page,Body)
          }
          @Post('admin-list-download')
          async downloadAdminRefferal( @AuthAdmin('userId') userId:string,@Query('search') search:string,@Body() Body){
                
                    return await this.userrefferalService.downloadAdminRefferal(userId,search,Body)
          }
}
