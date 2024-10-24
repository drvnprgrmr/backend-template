import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { UserGuard, UserPopulatedRequest } from 'src/user/user.guard';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { ResolveAccountDto } from './dto/resolve-account.dto';

@Controller('paystack')
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}

  @UseGuards(UserGuard)
  @Post('/transaction/initialize')
  initializeTransaction(
    @Req() req: UserPopulatedRequest,
    @Body() body: InitializeTransactionDto,
  ) {
    return this.paystackService.initializeTransaction(req.user.id, body);
  }

  /**
   * note: this route is provided for testing purposes only
   * the service is meant to be called externally
   */
  @UseGuards(UserGuard)
  @Get('/transaction/verify')
  verifyTransaction(@Query() query: VerifyTransactionDto) {
    return this.paystackService.verifyTransaction(query);
  }

  @UseGuards(UserGuard)
  @Get('/bank/resolve')
  resolveAccount(@Query() query: ResolveAccountDto) {
    return this.paystackService.resolveAccount(query);
  }
}
