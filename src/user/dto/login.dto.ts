import { IsStrongPassword } from 'class-validator';
import { EmailValidator } from 'src/common/decorators';

export class LoginDto {
  @EmailValidator()
  email: string;

  @IsStrongPassword()
  password: string;
}
