import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { UserStrategy } from './strategies/user.strategy';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';

@Module({
  imports: [PassportModule, JwtModule.registerAsync(jwtConfig)],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserStrategy, JwtUserStrategy],
})
export class AuthenticationModule {}
