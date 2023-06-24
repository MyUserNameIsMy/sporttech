import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import { UserRoleEntity } from '../../user/entities/user-role.entity';
import { ExpenditureType } from '../types/expenditure.type';
import { BankAccountEntity } from '../../bank/entities/bank-account.entity';

@Entity('events')
export class EventEntity extends RootAbstractEntity {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  code: string;

  @Column({
    type: 'timestamptz',
  })
  time_and_date: Date;

  @Column()
  place: string;

  @Column({ type: 'jsonb', nullable: true })
  expenditure: ExpenditureType[];

  @Column({ type: 'float' })
  total_expenditure: number;

  @OneToMany(() => UserRoleEntity, (user_role) => user_role.event)
  users_roles: UserRoleEntity[];

  // @OneToMany(() => InvitationEntity, (user_invitation) => user_invitation.event)
  // event_invites: InvitationEntity[];

  @OneToOne(() => BankAccountEntity)
  @JoinColumn()
  bank_account: BankAccountEntity;
}
