import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
