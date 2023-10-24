import { Controller, Get , Post,  HttpCode,  Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthUser } from 'src/users/middleware/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('create-payment-intent')
  paymentIntent(@AuthUser('id') id: string ,@Body() body) {
    return this.appService.paymentIntent(body);
  }

}
