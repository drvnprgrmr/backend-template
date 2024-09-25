import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';
import { NotificationType } from '../schemas/notification.schema';

export class CreateNotificationDto {
  @Type(() => Types.ObjectId)
  @IsMongoId()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsObject()
  @IsOptional()
  payload?: Record<string, string>;
}
