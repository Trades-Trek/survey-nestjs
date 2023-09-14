import { Injectable } from '@nestjs/common';
import { PayStackSecret } from 'src/helpers/User_Type';
import axios from 'axios';

const options = {
  headers: {
    Authorization: `Bearer ${PayStackSecret}`,
  },
};

@Injectable()
export class BankService {
  async findAll() {
  
    const { data } = await axios.get(
      `https://api.paystack.co/bank?country=nigeria`,
      options,
    );

    return data;
  }

  async verifyAccount(account_number: number, bank_code: number) {

    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      options,
    );

    return response.data;
  }
}
