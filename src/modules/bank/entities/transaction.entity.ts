import { Column, Entity, ManyToOne } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import { OperationEnum } from '../../../common/enums/operation.enum';
import { BankAccountEntity } from './bank-account.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('transactions')
export class TransactionEntity extends RootAbstractEntity {
  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'enum', enum: OperationEnum })
  operation_type: OperationEnum;

  @ManyToOne(
    () => BankAccountEntity,
    (bank_account) => bank_account.transactions,
  )
  bank_account: BankAccountEntity;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  user: UserEntity;
}
