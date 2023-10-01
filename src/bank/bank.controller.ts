import { Controller, Get, Query, Post, Body, Param, Res } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankAccountDto } from './bank.dto';
import { BankAccount } from './schema/bank.schema';
import { AuthUser } from 'src/users/middleware/auth.decorator';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}


  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.bankService.getOne(id);
  }

  @Post()
  async create( @AuthUser('id') id: string , @Body() createBankAccountDto: CreateBankAccountDto, @Res() res): Promise<BankAccount> {
   const createdBankAccount = await this.bankService.create(createBankAccountDto, id);
    return res.status(201).json( createdBankAccount);
  }
}
