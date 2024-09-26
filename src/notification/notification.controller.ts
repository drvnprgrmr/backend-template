import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserGuard, UserPopulatedRequest } from 'src/user/user.guard';
import { GetNotificationsDto } from './dto/get-notifications.dto';

@Controller('/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(UserGuard)
  @Get()
  getNotifications(
    @Req() req: UserPopulatedRequest,
    @Query() query: GetNotificationsDto,
  ) {
    return this.notificationService.getNotifications(req.user.id, query);
  }
}
