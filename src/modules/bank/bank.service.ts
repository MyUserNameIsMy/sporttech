import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionInRequestDto } from './dto/create-transaction-in.request.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { BankAccountEntity } from './entities/bank-account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OperationEnum } from '../../common/enums/operation.enum';
import { EventEntity } from '../event/entities/event.entity';
import { use } from 'passport';
import { UserRoleEntity } from '../user/entities/user-role.entity';

@Injectable()
export class BankService {
  async makeDepositBankAccount(
    transactionInDto: CreateTransactionInRequestDto,
  ): Promise<{ message: string }> {
    const user = await UserEntity.findOne({
      relations: ['bank_account'],
      where: { id: transactionInDto.user_id },
    });
    const event = await EventEntity.findOne({
      relations: ['bank_account'],
      where: { id: transactionInDto.event_id },
    });

    if (user.bank_account.value - transactionInDto.value < 0)
      throw new BadRequestException('Not enough money');

    const user_bank_account = await BankAccountEntity.findOne({
      where: {
        id: user.bank_account.id,
      },
    });

    const bank_account = await BankAccountEntity.findOne({
      where: {
        id: event.bank_account.id,
      },
    });
    user_bank_account.value -= transactionInDto.value;
    bank_account.value += transactionInDto.value;

    const transaction = new TransactionEntity();
    transaction.bank_account = event.bank_account;
    transaction.user = user;
    transaction.operation_type = OperationEnum.IN;
    transaction.value = transactionInDto.value;

    const user_role = await UserRoleEntity.findOne({
      relations: ['event', 'user'],
      where: {
        event: { id: event.id },
        user: { id: user.id },
      },
    });
    user_role.is_paid = true;

    try {
      await user_role.save();
      await user_bank_account.save();
      await bank_account.save();
      await user.save();
      await event.save();
      await transaction.save();
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
