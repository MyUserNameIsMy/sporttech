import { Body, Controller, Post } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateTransactionInRequestDto } from './dto/create-transaction-in.request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async makeDeposit(
    @Body() createTransactionInRequest: CreateTransactionInRequestDto,
  ): Promise<{ message: string }> {
    return await this.bankService.makeDeposit(createTransactionInRequest);
  }
}
