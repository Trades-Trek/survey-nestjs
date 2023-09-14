import { Controller, Get, Query } from '@nestjs/common';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}


  @Get()
  findAll() {
    return this.bankService.findAll();
  }

  @Get('verifyAccount')
  verifyAccount(@Query('account_number') accountNumber: number, @Query('bank_code') bankCode: number) {
    return this.bankService.verifyAccount(accountNumber, bankCode);
  }
}
