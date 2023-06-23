import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventRequestDto } from './dto/create-event.request.dto';
import { EventEntity } from './entities/event.entity';
import { generateUniqueString } from '../../common/utils/event-code.util';
import { UserRoleEntity } from '../user/entities/user-role.entity';
import { UserEntity } from '../user/entities/user.entity';
import { RoleEnum } from '../../common/enums/role.enum';

@Injectable()
export class EventService {
  async create(
    eventDto: CreateEventRequestDto,
    user_id: number,
  ): Promise<EventEntity> {
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

    return event;
  }

  async findAll(user_id: number): Promise<EventEntity[]> {
    return await EventEntity.find({
      relations: ['users_roles'],
      where: {
        users_roles: {
          user: {
            id: user_id,
          },
        },
      },
    });
  }

  async findAllByRole(user_id: number, role: RoleEnum): Promise<EventEntity[]> {
    return await EventEntity.find({
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
  }
}
