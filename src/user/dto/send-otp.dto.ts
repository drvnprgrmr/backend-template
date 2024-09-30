import { EmailValidator } from 'src/common/decorators';

export class SendOtpDto {
  @EmailValidator()
  email: string;
}
