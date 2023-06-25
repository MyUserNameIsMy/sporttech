import { Body, Controller, Param, Post } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateTransactionInRequestDto } from './dto/create-transaction-in.request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('pay')
  async makeDepositBankAccount(
    @Body() createTransactionInRequest: CreateTransactionInRequestDto,
  ): Promise<{ message: string }> {
    return await this.bankService.makeDepositBankAccount(
      createTransactionInRequest,
    );
  }

  @Post('add-money/:user_id')
  async makeDepositUserAccount(
    @Param('user_id') user_id: number,
  ): Promise<any> {
    return await this.bankService.makeDepositUserAccount(user_id);
  }

  @Post('return-money/:event_id')
  async returnMoney(
    @Param('event_id') event_id: number,
  ): Promise<{ message: string }> {
    return await this.bankService.returnMoney(event_id);
  }
}
