import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { REGEX, MESSAGES } from '../../../common/utils/password.utils';

export class RegisterUserRequestDto {
  @ApiProperty({
    description: 'The firstname of the User',
    example: 'Olzhas',
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'The lastname of the User',
    example: 'Syran',
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'The email address of the User',
    example: 'user@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the User',
    example: 'Password@123',
  })
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  password: string;

  @ApiProperty({
    description: 'Confirm the password',
    example: 'Password@123',
  })
  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  confirm: string;
}
