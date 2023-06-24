import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import * as bcrypt from 'bcrypt';
import { UserRoleEntity } from './user-role.entity';
import { TransactionEntity } from '../../bank/entities/transaction.entity';
import { BankAccountEntity } from '../../bank/entities/bank-account.entity';

@Entity('users')
export class UserEntity extends RootAbstractEntity {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @OneToMany(() => UserRoleEntity, (user_role) => user_role.event)
  users_roles: UserRoleEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];

  @OneToOne(() => BankAccountEntity, { onUpdate: 'CASCADE' })
  @JoinColumn()
  bank_account: BankAccountEntity;

  // @OneToMany(
  //   () => InvitationEntity,
  //   (user_invitation) => user_invitation.who_invited,
  // )
  // invitations_sent: InvitationEntity[];
  //
  // @OneToMany(
  //   () => InvitationEntity,
  //   (user_invitation) => user_invitation.whom_invited,
  // )
  // invitations_received: InvitationEntity[];

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
