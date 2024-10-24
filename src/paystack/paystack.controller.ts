import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { UserGuard, UserPopulatedRequest } from 'src/user/user.guard';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';

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
}
