import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  @Get('me')
  async findMe(@Request() req): Promise<any> {
    return req.user;
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
