import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import { RoleEnum } from '../../../common/enums/role.enum';
import { UserEntity } from './user.entity';
import { EventEntity } from '../../event/entities/event.entity';

@Entity('users_roles')
@Index(['user', 'event'], { unique: true })
export class UserRoleEntity extends RootAbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.users_roles)
  user: UserEntity;

  @ManyToOne(() => EventEntity, (event) => event.users_roles)
  event: EventEntity;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.PARTICIPANT,
  })
  role: RoleEnum;

  @Column({ type: 'boolean', default: false })
  is_paid: boolean;
}
