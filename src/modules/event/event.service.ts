import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventRequestDto } from './dto/create-event.request.dto';
import { EventEntity } from './entities/event.entity';
import { generateUniqueString } from '../../common/utils/event-code.util';
import { UserRoleEntity } from '../user/entities/user-role.entity';
import { UserEntity } from '../user/entities/user.entity';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { BankAccountEntity } from '../bank/entities/bank-account.entity';
import { EventStatusEnum } from '../../common/enums/event-status.enum';

@Injectable()
export class EventService {
  constructor(private readonly jwtService: JwtService) {}
  async exit(user_id: number, event_id: number): Promise<{ message: string }> {
    const user_role = await UserRoleEntity.findOne({
      relations: ['event', 'user'],
      where: {
        event: {
          id: event_id,
        },
        user: {
          id: user_id,
        },
      },
    });

    try {
      await user_role.remove();
    } catch (err) {}
    return { message: 'Success' };
  }
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
    event.total_expenditure = eventDto.expenditure.reduce(
      (accumulator, item) => accumulator + item.cost,
      0,
    );

    try {
      await event.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    const bank_account = new BankAccountEntity();
    bank_account.value = 0;
    try {
      await bank_account.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    try {
      event.bank_account = bank_account;
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
    const events = await EventEntity.find({
      relations: ['users_roles', 'bank_account'],
      select: [
        'id',
        'name',
        'code',
        'place',
        'time_and_date',
        'expenditure',
        'total_expenditure',
      ],
      where: {
        users_roles: {
          user: {
            id: user_id,
          },
        },
      },
    });
    events.forEach((item) => delete item.users_roles);
    return events;
  }

  async findAll(): Promise<EventEntity[]> {
    return await EventEntity.find({
      relations: ['bank_account'],
    });
  }
  async findAllByRole(user_id: number, role: RoleEnum): Promise<EventEntity[]> {
    const events = await EventEntity.find({
      relations: ['users_roles', 'bank_account'],
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
    const event = await EventEntity.findOne({
      relations: ['users_roles', 'bank_account', 'users_roles.user'],
      where: { id: event_id },
    });
    const payment_value = event.total_expenditure / event.users_roles.length;
    event['participants'] = event.users_roles.map((item) => {
      return {
        participant_id: item.user.id,
        participant_role: item.role,
        participant_email: item.user.email,
        participant_firstname: item.user.firstname,
        participant_lastname: item.user.lastname,
        participant_is_paid: item.is_paid,
        participant_payment_value: payment_value,
      };
    });

    delete event.users_roles;

    return event;
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

  async changeStatus(
    event_id: number,
    event_status: EventStatusEnum,
  ): Promise<{ message: string }> {
    const event = await this.findOne(event_id);
    event.event_status = event_status;
    try {
      await event.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
    return { message: 'Success' };
  }
}
