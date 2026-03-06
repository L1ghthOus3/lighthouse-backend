/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^\d+$/, {
    message: 'Password must contain only numbers',
  })
  password: string;
}
