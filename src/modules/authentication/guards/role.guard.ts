import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from '../../../common/enums/role.enum';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard extends AuthGuard('jwt-user') implements CanActivate {
  roles: RoleEnum[] = [];
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles) {
      this.roles = requiredRoles;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    console.log(this.roles);

    if (this.roles?.includes(user.role)) {
      throw new ForbiddenException('no role');
    }

    return user;
  }
}
