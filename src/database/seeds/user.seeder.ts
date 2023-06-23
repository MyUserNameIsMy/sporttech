import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { RoleEnum } from '../../common/enums/role.enum';

export default class UserSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(UserEntity);
    const users = await userFactory.saveMany(12);
    await UserEntity.save(users);
  }
}
