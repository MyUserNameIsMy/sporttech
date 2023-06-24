import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransactionInRequestDto {
  @ApiProperty({
    description: 'The ID of the bank account involved in the transaction.',
    example: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
  })
  @IsUUID()
  bank_account_id: string;

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
