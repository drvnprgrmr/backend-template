import { IsStrongPassword, Matches } from 'class-validator';
import { UsernameRegex } from 'src/common/regex';

export class LoginDto {
  @Matches(UsernameRegex)
  username: string;

  @IsStrongPassword()
  password: string;
}
