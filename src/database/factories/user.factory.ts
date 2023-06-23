import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../../modules/user/entities/user.entity';

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();
  user.email = faker.internet.email();
  user.password = 'Password123@';
  return user;
});
