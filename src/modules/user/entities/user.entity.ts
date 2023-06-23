import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import * as bcrypt from 'bcrypt';
import { UserRoleEntity } from './user-role.entity';

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

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
