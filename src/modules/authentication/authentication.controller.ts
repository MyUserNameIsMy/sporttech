import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequestDto } from './dto/login.request.dto';
import { RegisterUserRequestDto } from './dto/register-user.request.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(AuthGuard('user'))
  @Post('login')
  @ApiBody({
    type: LoginRequestDto,
  })
  async login(@Request() req: any): Promise<{ access_token: string }> {
    return this.authService.generateToken(req.user);
  }

  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Request() req: any): Promise<{ access_token: string }> {
    return this.authService.refreshToken(+req.user.user_id);
  }

  @Post('register')
  async registerUser(
    @Body() userRegisterRequestDto: RegisterUserRequestDto,
  ): Promise<{ access_token: string }> {
    return this.authService.registerUser(userRegisterRequestDto);
  }
}
