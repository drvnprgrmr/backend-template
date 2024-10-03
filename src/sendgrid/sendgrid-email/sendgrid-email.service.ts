import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

import { Config } from 'src/config';

export enum SendgridEmailTemplate {
  EMAIL_VERIFICATION = 'd-1',
  RESET_PASSWORD = 'd-2',
  NEW_NOTIFICATION = 'd-3',
  TEST = 'd-8f45af1aa8e64667989f11ea91577e60',
}

export enum SendgridEmailAddress {
  SUPPORT = 'support@example.com',
  NO_REPLY = 'noreply@example.com',
  TEST = 'test@sphiderassweb.org',
}

@Injectable()
export class SendgridEmailService {
  private readonly logger = new Logger(SendgridEmailService.name);

  constructor(private readonly configService: ConfigService<Config, true>) {
    const sgApiKey = this.configService.get('sendgrid.apiKey', { infer: true });
    sgMail.setApiKey(sgApiKey);
  }

  private async send(mail: MailDataRequired) {
    try {
      await sgMail.send(mail);
    } catch (err) {
      const sgErrors: {
        message: string;
        field: string;
        help: string | null;
      }[] = err.response?.body?.errors;

      sgErrors && sgErrors.forEach((sgError) => this.logger.error(sgError));

      throw err;
    }
  }

  async sendFromTemplate(data: {
    from?: SendgridEmailAddress;
    replyTo?: string;
    to: SendgridEmailAddress | string;
    templateId: SendgridEmailTemplate;
    dynamicTemplateData: object;
  }) {
    const { from, replyTo, to, templateId, dynamicTemplateData } = data;

    await this.send({
      from: from || SendgridEmailAddress.SUPPORT,
      replyTo: replyTo || from || undefined,
      to,
      templateId,
      dynamicTemplateData,
    });
  }
}
