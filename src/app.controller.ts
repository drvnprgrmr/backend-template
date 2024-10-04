import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateMailingListDto } from './app/dto/update-mailing-list.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SubmitFormDto } from './app/dto/submit-form.dto';
import { GetBankAccountNameDto } from './app/dto/get-bank-account-name.dto';
import { GetQrcodeDto } from './app/dto/get-qrcode.dto';

@UseGuards(ThrottlerGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Put('/mailing-list')
  updateMailingList(@Body() body: UpdateMailingListDto) {
    return this.appService.updateMailingList(body);
  }

  @Post('/form')
  submitForm(@Body() body: SubmitFormDto) {
    return this.appService.submitForm(body);
  }

  @Get('/bank-account-name')
  async getBankAccountName(@Query() query: GetBankAccountNameDto) {
    return this.appService.getBankAccountName(query);
  }

  @Get('/qrcode')
  async getQrcode(@Query() query: GetQrcodeDto) {
    return this.appService.getQrcode(query);
  }
}
