import {
  IsBooleanString,
  IsDate,
  IsEnum,
  IsNumber,
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

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number = 20;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastCreatedAt?: Date;
}
