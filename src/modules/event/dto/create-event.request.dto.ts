import { ApiProperty } from '@nestjs/swagger';

export class CreateEventRequestDto {
  @ApiProperty({
    example: 'Example Name',
    description: 'The name of the event',
  })
  name: string;

  @ApiProperty({
    type: Date,
    example: '2023-06-23T10:30:00Z',
    description: 'The date and time of the event',
  })
  time_and_date: Date;

  @ApiProperty({
    example: 'Example Place',
    description: 'The location of the event',
  })
  place: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Example Expenditure Name',
          description: 'The name of the expenditure',
        },
        cost: {
          type: 'number',
          example: 10.5,
          description: 'The cost of the expenditure',
        },
      },
    },
    example: [
      { name: 'Expenditure 1', cost: 20 },
      { name: 'Expenditure 2', cost: 15.75 },
    ],
    description: 'The list of expenditures associated with the event',
  })
  expenditure: ExpenditureType[];
}
class ExpenditureType {
  @ApiProperty({
    example: 'Example Expenditure Name',
    description: 'The name of the expenditure',
  })
  name: string;

  @ApiProperty({ example: 10.5, description: 'The cost of the expenditure' })
  cost: number;
}
