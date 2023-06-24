import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionInRequestDto } from './dto/create-transaction-in.request.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { BankAccountEntity } from './entities/bank-account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OperationEnum } from '../../common/enums/operation.enum';

@Injectable()
export class BankService {
  async makeDeposit(
    transactionInDto: CreateTransactionInRequestDto,
  ): Promise<{ message: string }> {
    const transaction = new TransactionEntity();
    const bank_account = await BankAccountEntity.findOne({
      where: { id: transactionInDto.bank_account_id },
    });
    transaction.bank_account = bank_account;

    transaction.user = await UserEntity.findOne({
      where: { id: transactionInDto.user_id },
    });
    transaction.operation_type = OperationEnum.IN;
    transaction.value = transactionInDto.value;

    try {
      await transaction.save();
      bank_account.value += transaction.value;
      await bank_account.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return { message: 'Success' };
  }
}
