import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private authService: AuthenticationService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validate(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
