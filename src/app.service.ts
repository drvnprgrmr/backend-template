import { Injectable } from '@nestjs/common';
import {
  SendgridEmailAddress,
  SendgridEmailService,
  SendgridEmailTemplate,
} from './sendgrid/sendgrid-email/sendgrid-email.service';
import { APP_NAME } from './config';
import { UpdateMailingListDto } from './app/dto/update-mailing-list.dto';
import { SubmitFormDto } from './app/dto/submit-form.dto';

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

  async submitForm(dto: SubmitFormDto) {
    const { email, ...rest } = dto;

    await this.sendgridEmailService.sendFromTemplate({
      from: SendgridEmailAddress.NO_REPLY,
      to: SendgridEmailAddress.SUPPORT,
      replyTo: email,
      templateId: SendgridEmailTemplate.TEST,
      dynamicTemplateData: rest,
    });

    return { message: 'Form submitted!' };
  }
}
