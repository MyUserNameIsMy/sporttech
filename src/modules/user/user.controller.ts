import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
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

  // @ApiExcludeEndpoint()
  // @UseGuards(AuthGuard('jwt-user'))
  // @ApiBearerAuth()
  // @Get('received_invites')
  // async findReceivedInvites(@Request() req): Promise<any> {
  //   return this.userService.findReceivedInvites(+req.user.user_id);
  // }
  //
  // @ApiExcludeEndpoint()
  // @UseGuards(AuthGuard('jwt-user'))
  // @ApiBearerAuth()
  // @Get('sent_invites')
  // async findSentInvites(@Request() req): Promise<any> {
  //   return this.userService.findSentInvites(+req.user.user_id);
  // }
}
