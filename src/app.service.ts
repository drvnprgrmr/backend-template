import { Injectable } from '@nestjs/common';
import {
  SendgridEmailAddress,
  SendgridEmailService,
  SendgridEmailTemplate,
} from './sendgrid/sendgrid-email/sendgrid-email.service';
import { APP_NAME, Config } from './config';
import { UpdateMailingListDto } from './app/dto/update-mailing-list.dto';
import { SubmitFormDto } from './app/dto/submit-form.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetBankAccountNameDto } from './app/dto/get-bank-account-name.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly sendgridEmailService: SendgridEmailService,
  ) {}

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

  async getBankAccountName(dto: GetBankAccountNameDto) {
    const { bankCode, accountNumber } = dto;

    const url = new URL('https://app.nuban.com.ng');
    url.pathname = `/api/${this.configService.get('nubanApiKey', { infer: true })}`;
    url.searchParams.set('acc_no', accountNumber);
    url.searchParams.set('bank_code', bankCode);

    const { data: responseData } = await axios.get(url.toString());

    if (!responseData || !Array.isArray(responseData)) {
      return { errorMessage: 'Error getting account info.' };
    }

    return {
      message: 'Bank info fetched successfully!',
      data: { accountName: responseData[0].account_name },
    };
  }
}
