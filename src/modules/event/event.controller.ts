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
import { RoleGuard } from '../authentication/guards/role.guard';
import { RoleDecorator } from '../../common/decorators/role.decorator';

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

  // @Get()
  // async findAll(): Promise<EventEntity[]> {
  //   return await this.eventService.findAll();
  // }

  // @Get(':event_id')
  // async findOne(@Param('event_id') event_id: number): Promise<EventEntity> {
  //   return await this.eventService.findOne(event_id);
  // }

  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  @Get()
  async findAllLogged(@Request() req): Promise<EventEntity[]> {
    return await this.eventService.findAllLogged(+req.user.user_id);
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

  @RoleDecorator(RoleEnum.ORGANIZATOR, RoleEnum.PARTICIPANT)
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Get(':event_id')
  async findOneLogged(
    @Request() req,
    @Param('event_id') event_id: number,
  ): Promise<EventEntity> {
    return await this.eventService.findOne(event_id);
  }

  @RoleDecorator(RoleEnum.ORGANIZATOR)
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Get('generate-invite-token/:event_id')
  async generateInviteToken(
    @Request() req,
    @Param('event_id') event_id: number,
  ): Promise<{ invite_token: string }> {
    return await this.eventService.generateInviteToken(req.user, event_id);
  }
}
