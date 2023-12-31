import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmAsyncConfig } from './config/orm-async.config';
import { EventModule } from './modules/event/event.module';
import { BankModule } from './modules/bank/bank.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(OrmAsyncConfig),
    UserModule,
    AuthenticationModule,
    EventModule,
    BankModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
