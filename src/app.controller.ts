import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateMailingListDto } from './app/dto/update-mailing-list.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(ThrottlerGuard)
  @Put('/mailing-list')
  updateMailingList(@Body() body: UpdateMailingListDto) {
    return this.appService.updateMailingList(body);
  }
}
