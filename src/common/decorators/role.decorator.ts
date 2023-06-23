import { RoleEnum } from '../enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const RoleDecorator = (...roles: RoleEnum[]) =>
  SetMetadata('roles', roles);
