import { Injectable } from '@nestjs/common';
import { SendgridEmailService } from './sendgrid/sendgrid-email/sendgrid-email.service';
import { APP_NAME } from './config';
import { UpdateMailingListDto } from './app/dto/update-mailing-list.dto';

@Injectable()
export class AppService {
  constructor(private readonly sendgridEmailService: SendgridEmailService) {}

  getHello(): string {
    return `${APP_NAME} api says: "Hello World!"`;
  }

  async updateMailingList(dto: UpdateMailingListDto) {
    const { contact } = dto;

    await this.sendgridEmailService.addContactToList(contact);

    return { message: 'List updated.' };
  }
}
