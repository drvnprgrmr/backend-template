import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig, Config } from 'src/config';

import * as hbs from 'handlebars';

// todo: add ability to create template and add controller to handle it
// todo: add email templates to a folder
// todo: create all templates if they don't exist on server startup

@Injectable()
export class AwsSesService {
  private readonly logger = new Logger(AwsSesService.name);
  private readonly awsConfig: AwsConfig;
  private readonly client: SESClient;

  constructor(private readonly configService: ConfigService<Config, true>) {
    this.awsConfig = this.configService.get('aws', { infer: true });
    this.client = new SESClient({ region: this.awsConfig.region });
  }

  async sendEmail(data: { from?: string; to: string | string[] }) {
    try {
      const { from, to } = data;

      const sendEmailCommand = new SendEmailCommand({
        Destination: {
          ToAddresses: Array.isArray(to) ? to : [to],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: '',
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'BeedPlus - Email Address Verification',
          },
        },
        Source: from,
      });

      const response = await this.client.send(sendEmailCommand);

      this.logger.verbose('Email sent successfully!', response);

      return response;
    } catch (err) {
      // todo: handle errors
      this.logger.error(err);
    }
  }
}
