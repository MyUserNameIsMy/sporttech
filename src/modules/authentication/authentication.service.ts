import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterRequestDto } from './dto/user-register.request.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}
  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await UserEntity.findOne({
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
    return {
      access_token: this.jwtService.sign(
        {
          user_id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        {
          expiresIn: '3d',
        },
      ),
    };
  }

  async registerUser(
    userDto: UserRegisterRequestDto,
  ): Promise<{ access_token: string }> {
    const user = new UserEntity();
    user.firstname = userDto.firstname;
    user.lastname = userDto.lastname;
    user.email = userDto.email;
    user.password = userDto.password;

    try {
      await user.save();
      return this.generateToken(user);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
