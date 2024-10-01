import { Module } from '@nestjs/common';
import { SendgridEmailService } from './sendgrid-email.service';

@Module({
  providers: [SendgridEmailService],
  exports: [SendgridEmailService],
})
export class SendgridEmailModule {}
