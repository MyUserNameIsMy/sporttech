import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionInRequestDto } from './dto/create-transaction-in.request.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { BankAccountEntity } from './entities/bank-account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OperationEnum } from '../../common/enums/operation.enum';

@Injectable()
export class BankService {
  async makeDepositBankAccount(
    transactionInDto: CreateTransactionInRequestDto,
  ): Promise<{ message: string }> {
    const user = await UserEntity.findOne({
      relations: ['bank_account'],
      where: { id: transactionInDto.user_id },
    });

    const user_bank_account = await BankAccountEntity.findOne({
      where: { id: user.bank_account.id },
    });

    if (user_bank_account.value - transactionInDto.value < 0)
      throw new BadRequestException('Not enough money');
    const transaction = new TransactionEntity();
    const bank_account = await BankAccountEntity.findOne({
      where: { id: transactionInDto.bank_account_id },
    });
    transaction.bank_account = bank_account;
    transaction.operation_type = OperationEnum.IN;
    transaction.value = transactionInDto.value;

    try {
      user_bank_account.value -= transaction.value;
      await user_bank_account.save();
      user.bank_account = user_bank_account;
      await user.save();
      await transaction.save();
      bank_account.value += transaction.value;
      await bank_account.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return { message: 'Success' };
  }

  async makeDepositUserAccount(user_id: number): Promise<any> {
    const user = await UserEntity.findOne({
      relations: ['bank_account'],
      where: { id: user_id },
    });
    const bank_account = await BankAccountEntity.findOne({
      where: { id: user.bank_account.id },
    });

    try {
      bank_account.value += 1000;
      await bank_account.save();
      user.bank_account = bank_account;
      await user.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    // return { message: 'Success' };
    return user;
  }

  async returnMoney(event_id: number): Promise<{ message: string }> {
    return { message: 'Success' };
  }
}
