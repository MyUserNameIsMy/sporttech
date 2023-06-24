import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserRequestDto } from './dto/register-user.request.dto';
import { UserRoleEntity } from '../user/entities/user-role.entity';
import { BankAccountEntity } from '../bank/entities/bank-account.entity';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}
  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await UserEntity.findOne({
      relations: ['bank_account'],
      where: { email: username },
      select: ['id', 'email', 'password', 'firstname', 'lastname'],
    });
    console.log(user);
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async generateToken(user: UserEntity): Promise<{ access_token: string }> {
    const users_roles = await UserRoleEntity.find({
      relations: ['user', 'event'],
      where: {
        user: {
          id: user.id,
        },
      },
    });
    console.log(users_roles);
    return {
      access_token: this.jwtService.sign(
        {
          user_id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          bank_account: user.bank_account,
          events: users_roles.map((item) => {
            return {
              role: item.role,
              event_id: item.event.id,
            };
          }),
        },
        {
          expiresIn: '3d',
        },
      ),
    };
  }

  async refreshToken(user: any): Promise<{ access_token: string }> {
    const users_roles = await UserRoleEntity.find({
      relations: ['user', 'event'],
      where: {
        user: {
          id: user.user_id,
        },
      },
    });
    console.log(users_roles);
    return {
      access_token: this.jwtService.sign(
        {
          user_id: user.user_id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          bank_account: user.bank_account,
          events: users_roles.map((item) => {
            return {
              role: item.role,
              event_id: item.event.id,
            };
          }),
        },
        {
          expiresIn: '3d',
        },
      ),
    };
  }

  async registerUser(
    userDto: RegisterUserRequestDto,
  ): Promise<{ access_token: string }> {
    const user = new UserEntity();
    user.firstname = userDto.firstname;
    user.lastname = userDto.lastname;
    user.email = userDto.email;
    user.password = userDto.password;

    const bank_account = new BankAccountEntity();
    bank_account.value = 0;
    try {
      await bank_account.save();
      user.bank_account = bank_account;
      await user.save();
      return this.generateToken(user);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
