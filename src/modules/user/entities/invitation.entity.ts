import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { EventEntity } from '../../event/entities/event.entity';
import { InviteStatusEnum } from '../../../common/enums/invite-status.enum';

@Entity('invitations')
export class InvitationEntity extends RootAbstractEntity {
  // @ManyToOne(() => UserEntity, (user) => user.invitations_sent)
  // who_invited: UserEntity;
  //
  // @ManyToOne(() => UserEntity, (user) => user.invitations_received)
  // whom_invited: UserEntity;
  //
  // @ManyToOne(() => EventEntity, (event) => event.event_invites)
  // event: EventEntity;

  @Column({
    type: 'enum',
    enum: InviteStatusEnum,
    default: InviteStatusEnum.CREATED,
  })
  status: InviteStatusEnum;
}
