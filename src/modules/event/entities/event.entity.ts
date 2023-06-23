import { Column, Entity, OneToMany } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import { UserRoleEntity } from '../../user/entities/user-role.entity';
import { ExpenditureType } from '../types/expenditure.type';

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

  @OneToMany(() => UserRoleEntity, (user_role) => user_role.event)
  users_roles: UserRoleEntity[];
}
