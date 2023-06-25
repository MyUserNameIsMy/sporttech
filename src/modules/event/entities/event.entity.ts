import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import { UserRoleEntity } from '../../user/entities/user-role.entity';
import { ExpenditureType } from '../types/expenditure.type';
import { BankAccountEntity } from '../../bank/entities/bank-account.entity';
import { EventStatusEnum } from '../../../common/enums/event-status.enum';

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

  @Column({
    type: 'enum',
    enum: EventStatusEnum,
    default: EventStatusEnum.CREATED,
  })
  event_status: EventStatusEnum;

  @OneToMany(() => UserRoleEntity, (user_role) => user_role.event, {
    onDelete: 'CASCADE',
  })
  users_roles: UserRoleEntity[];

  // @OneToMany(() => InvitationEntity, (user_invitation) => user_invitation.event)
  // event_invites: InvitationEntity[];

  @OneToOne(() => BankAccountEntity)
  @JoinColumn()
  bank_account: BankAccountEntity;
}
