import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InvitationEntity } from './entities/invitation.entity';

@Injectable()
export class UserService {
  async findAll(): Promise<UserEntity[]> {
    return await UserEntity.find();
  }

  // async findReceivedInvites(user_id: number) {
  //   return await InvitationEntity.find({
  //     relations: ['whom_invited'],
  //     where: {
  //       whom_invited: {
  //         id: user_id,
  //       },
  //     },
  //   });
  // }
  //
  // async findSentInvites(user_id: number) {
  //   return await InvitationEntity.find({
  //     relations: ['who_invited'],
  //     where: {
  //       whom_invited: {
  //         id: user_id,
  //       },
  //     },
  //   });
  // }
}
