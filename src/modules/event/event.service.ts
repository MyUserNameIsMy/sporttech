import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventRequestDto } from './dto/create-event.request.dto';
import { EventEntity } from './entities/event.entity';
import { generateUniqueString } from '../../common/utils/event-code.util';
import { UserRoleEntity } from '../user/entities/user-role.entity';
import { UserEntity } from '../user/entities/user.entity';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EventService {
  constructor(private readonly jwtService: JwtService) {}
  async create(
    eventDto: CreateEventRequestDto,
    user_id: number,
  ): Promise<{ message: string }> {
    const event = new EventEntity();
    event.name = eventDto.name;
    event.code = generateUniqueString();
    event.time_and_date = eventDto.time_and_date;
    event.place = eventDto.place;
    event.expenditure = eventDto.expenditure;
    try {
      await event.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    const user_role = new UserRoleEntity();
    user_role.event = event;
    user_role.user = await UserEntity.findOne({ where: { id: user_id } });
    user_role.role = RoleEnum.ORGANIZATOR;

    try {
      await user_role.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return { message: 'Success' };
  }

  async findAllLogged(user_id: number): Promise<EventEntity[]> {
    return await EventEntity.find({
      relations: ['users_roles'],
      select: ['id', 'name', 'code', 'place', 'time_and_date', 'expenditure'],
      where: {
        users_roles: {
          user: {
            id: user_id,
          },
        },
      },
    });
  }

  async findAll(): Promise<EventEntity[]> {
    return await EventEntity.find();
  }
  async findAllByRole(user_id: number, role: RoleEnum): Promise<EventEntity[]> {
    const events = await EventEntity.find({
      relations: ['users_roles'],
      where: {
        users_roles: {
          user: {
            id: user_id,
          },
          role: role,
        },
      },
    });
    events.forEach((item) => delete item.users_roles);
    return events;
  }

  async findOne(event_id: number): Promise<EventEntity> {
    return await EventEntity.findOne({ where: { id: event_id } });
  }

  async generateInviteToken(
    user: any,
    event_id: number,
  ): Promise<{ invite_token: string }> {
    const invite_token = this.jwtService.sign(
      {
        who_invited: user.user_id,
        event_id: event_id,
      },
      {
        expiresIn: '1d',
      },
    );
    return { invite_token: invite_token };
  }

  async validateInviteToken(
    user_id: number,
    invite_token: string,
  ): Promise<{ message: string }> {
    try {
      await this.jwtService.verifyAsync(invite_token);
    } catch (err) {
      throw new BadRequestException({ description: 'Invalid Token' });
    }

    const token_data: any = this.jwtService.decode(invite_token);

    if (user_id === token_data.who_invited) return { message: 'Success' };

    const user_role = new UserRoleEntity();
    user_role.event = await this.findOne(token_data?.event_id);
    user_role.user = await UserEntity.findOne({ where: { id: user_id } });
    try {
      await user_role.save();
      return { message: 'Success' };
    } catch (err) {
      throw new BadRequestException('Join Problem');
    }
  }
}
