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
  event_id: number;
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

    if (requiredRoles && context.switchToHttp().getRequest().params?.event_id) {
      this.roles = requiredRoles;
      this.event_id = context.switchToHttp().getRequest().params?.event_id;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    console.log(this.roles);

    if (this.roles) {
      if (!user.events) throw new ForbiddenException('No events');
      const user_roles = user.events
        .filter((item) => item.event_id == this.event_id)
        .map((item) => item.role);
      console.log(user_roles);
      if (!user_roles.some((item) => this.roles.includes(item)))
        throw new ForbiddenException('no role');
    }

    return user;
  }
}
