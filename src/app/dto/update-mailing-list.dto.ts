import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ContactDto } from 'src/sendgrid/sendgrid-email/dto/contact.dto';

export class UpdateMailingListDto {
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => ContactDto)
  contact: ContactDto;
}
