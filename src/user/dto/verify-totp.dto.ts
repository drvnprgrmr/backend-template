import { IsNumberString, Length } from 'class-validator';

export class VerifyTOTPDto {
  @Length(6, 6)
  @IsNumberString()
  token: string;
}
