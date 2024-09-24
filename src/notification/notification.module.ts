import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { UserModule } from 'src/user/user.module';
import { SendgridEmailService } from 'src/common/services/sendgrid-email.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Notification.name,
        useFactory() {
          const schema = NotificationSchema;

          schema.index(
            { updatedAt: -1 },
            { expires: '30d', partialFilterExpression: { keep: false } },
          );

          return schema;
        },
      },
    ]),
  ],
  providers: [NotificationService, SendgridEmailService],
  controllers: [NotificationController],
})
export class NotificationModule {}
