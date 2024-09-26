import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import {
  Notification,
  NotificationStatus,
} from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserNotFoundException } from 'src/user/exceptions';
import {
  FirebaseMessagingService,
  SendgridEmailService,
  SendgridEmailTemplate,
} from 'src/common/services';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class NotificationService {
  private readonly logger: Logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly userService: UserService,
    private readonly firebaseMessagingService: FirebaseMessagingService,
    private readonly sendgridEmailService: SendgridEmailService,
  ) {}

  async createNotification(
    dto: CreateNotificationDto,
    { sendEmail = false, sendPush = false },
  ) {
    const { userId, title, body, image, type, payload } = dto;

    const user = await this.userService.userModel.findById(userId).exec();

    if (!user) throw new UserNotFoundException();

    const notification = await this.notificationModel.create({
      user: userId,
      title,
      body,
      image,
      type,
      payload,
    });

    if (user.fcmToken && sendPush)
      this.firebaseMessagingService.sendWithToken({
        token: user.fcmToken,
        title,
        body,
        image,
        data: { ...payload, type },
      });

    if (sendEmail)
      this.sendgridEmailService.sendFromTemplate({
        to: user.email.value,
        templateId: SendgridEmailTemplate.NEW_NOTIFICATION,
        dynamicTemplateData: { name: user.username || user.fullName },
      });

    user.unreadNotifications++;
    await user.save();

    return notification;
  }

  async getNotifications(userId: Types.ObjectId, dto: GetNotificationsDto) {
    const { status, lastCreatedAt } = dto;

    const filter: FilterQuery<Notification> = { user: userId };

    status && (filter.status = status);
    lastCreatedAt && (filter.createdAt = { $lt: lastCreatedAt });

    const notifications = await this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    await this.notificationModel
      .updateMany(
        {
          user: userId,
          status: NotificationStatus.UNREAD,
        },
        { $set: { status: NotificationStatus.READ } },
      )
      .exec();

    await this.userService.userModel
      .updateOne({ _id: userId }, { $set: { unreadNotifications: 0 } })
      .exec();

    return {
      message: 'Notifications fetched successfully!',
      data: { notifications },
    };
  }
}
