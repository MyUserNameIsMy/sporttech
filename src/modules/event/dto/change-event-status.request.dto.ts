import { ApiProperty } from '@nestjs/swagger';
import { EventStatusEnum } from '../../../common/enums/event-status.enum';

export class ChangeEventStatusRequestDto {
  @ApiProperty({
    example: EventStatusEnum.CREATED,
    description: 'The status of the event',
  })
  event_status: EventStatusEnum;
}
