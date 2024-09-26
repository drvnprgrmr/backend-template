import {
  IsBooleanString,
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { NotificationStatus } from '../schemas/notification.schema';
import { Type } from 'class-transformer';

export class GetNotificationsDto {
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @IsBooleanString()
  @IsOptional()
  keep?: boolean;

  @IsNumberString()
  @IsOptional()
  limit?: number = 20;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastCreatedAt?: Date;
}
