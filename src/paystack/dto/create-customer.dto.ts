import { IsPhoneNumber } from 'class-validator';
import { EmailValidator, TitleValidator } from 'src/common/decorators';

export class CreateCustomerDto {
  @TitleValidator()
  first_name: string;

  @TitleValidator()
  last_name: string;

  @EmailValidator()
  email: string;

  @IsPhoneNumber()
  phone: string;
}
