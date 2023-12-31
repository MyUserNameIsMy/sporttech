import {
  Body,
  Request,
  Controller,
  Param,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateTransactionInRequestDto } from './dto/create-transaction-in.request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleDecorator } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { RoleGuard } from '../authentication/guards/role.guard';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  @Post('pay')
  async makeDepositBankAccount(
    @Request() req,
    @Body() createTransactionInRequest: CreateTransactionInRequestDto,
  ): Promise<{ message: string }> {
    return await this.bankService.makeDepositBankAccount(
      +req.user.user_id,
      createTransactionInRequest,
    );
  }

  @Post('add-money/:user_id')
  async makeDepositUserAccount(
    @Param('user_id') user_id: number,
  ): Promise<any> {
    return await this.bankService.makeDepositUserAccount(user_id);
  }

  @RoleDecorator(RoleEnum.ORGANIZATOR)
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Delete('return-money/:event_id')
  async returnMoney(
    @Param('event_id') event_id: number,
  ): Promise<{ message: string }> {
    return await this.bankService.returnMoney(event_id);
  }
}
