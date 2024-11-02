import { IsObject, IsString } from 'class-validator';

export class WebhookDto {
  @IsString()
  event: string;

  @IsObject()
  data: object;
}
