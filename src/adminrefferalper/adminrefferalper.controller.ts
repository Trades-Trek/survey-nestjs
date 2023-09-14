import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUser } from 'src/users/middleware/auth.decorator';
import { AdminrefferalperService } from './adminrefferalper.service';

@Controller('adminrefferalper')
export class AdminrefferalperController {

          constructor(private adminRefferalService: AdminrefferalperService) { }
          @Get('')
          async refferalPer(@AuthUser('userId') userId: string,) {

                    return await this.adminRefferalService.getRefferalPer(userId)
          }

          @Post('')
          async refferalPerAdd(@AuthUser('userId') userId: string,@Body() body) {
                    return await this.adminRefferalService.addRefferalPer(userId, body)
          }





}
