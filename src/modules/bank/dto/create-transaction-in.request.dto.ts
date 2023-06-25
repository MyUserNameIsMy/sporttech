import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateTransactionInRequestDto {
  @ApiProperty({
    description: 'The ID of the bank account involved in the transaction.',
    example: 1,
  })
  event_id: number;

  @ApiProperty({
    description: 'The ID of the user associated with the transaction.',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'The value of the transaction.',
    minimum: 0,
    example: 100.5,
  })
  @IsNumber()
  @Min(0)
  value: number;
}
