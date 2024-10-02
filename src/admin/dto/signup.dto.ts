import { IsStrongPassword, Matches } from 'class-validator';
import { UsernameRegex } from 'src/common/regex';

export class SignupDto {
  @Matches(UsernameRegex)
  username: string;

  @IsStrongPassword()
  password: string;
}
