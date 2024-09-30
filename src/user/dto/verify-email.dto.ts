import { Matches } from 'class-validator';
import { EmailValidator } from 'src/common/decorators';

export class VerifyEmailDto {
  @EmailValidator()
  email: string;

  @Matches(/^\d{6}$/)
  otp: string;
}
