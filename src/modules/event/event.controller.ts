import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventRequestDto } from './dto/create-event.request.dto';
import { EventEntity } from './entities/event.entity';
import { RoleEnum } from '../../common/enums/role.enum';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  @Post()
  async registerSuperAdmin(
    @Request() req,
    @Body() eventCreateRequestDto: CreateEventRequestDto,
  ): Promise<any> {
    return await this.eventService.create(
      eventCreateRequestDto,
      +req.user.user_id,
    );
  }

  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() req): Promise<EventEntity[]> {
    return await this.eventService.findAll(+req.user.user_id);
  }

  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  @Get('filter_by_role/:role')
  async findAllByRole(
    @Request() req,
    @Param('role') role: RoleEnum,
  ): Promise<EventEntity[]> {
    return await this.eventService.findAllByRole(+req.user.user_id, role);
  }
}
