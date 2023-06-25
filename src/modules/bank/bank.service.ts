import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionInRequestDto } from './dto/create-transaction-in.request.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { BankAccountEntity } from './entities/bank-account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OperationEnum } from '../../common/enums/operation.enum';
import { EventEntity } from '../event/entities/event.entity';
import { use } from 'passport';
import { UserRoleEntity } from '../user/entities/user-role.entity';
import { find } from 'rxjs';
import { In } from 'typeorm';

@Injectable()
export class BankService {
  async makeDepositBankAccount(
    user_id: number,
    transactionInDto: CreateTransactionInRequestDto,
  ): Promise<{ message: string }> {
    const user = await UserEntity.findOne({
      relations: ['bank_account'],
      where: { id: user_id },
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
    const event = await EventEntity.findOne({
      relations: ['users_roles', 'users_roles.user', 'bank_account'],
      where: {
        id: event_id,
        users_roles: {
          is_paid: true,
        },
      },
    });
    const user_ids = event.users_roles.map((item) => item.user.id);
    console.log(user_ids);

    for (const user_id of user_ids) {
      const user = await UserEntity.findOne({
        relations: ['bank_account'],
        where: { id: user_id },
      });
      console.log(user);
      const transaction = await TransactionEntity.findOne({
        relations: ['bank_account'],
        where: {
          bank_account: {
            id: event.bank_account.id,
          },
          user: {
            id: user.id,
          },
        },
      });

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
      user_bank_account.value += transaction.value;
      bank_account.value -= transaction.value;

      await user_bank_account.save();
      await bank_account.save();
      await user.save();
    }

    const users_roles = await UserRoleEntity.find({
      relations: ['event', 'user'],
      where: {
        event: {
          id: event.id,
        },
        user: {
          id: In(user_ids),
        },
      },
    });
    if (users_roles) await UserRoleEntity.remove(users_roles);

    await event.remove();

    return { message: 'Success' };
  }
}
