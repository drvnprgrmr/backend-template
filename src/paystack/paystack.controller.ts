import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { UserGuard, UserPopulatedRequest } from 'src/user/user.guard';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { ResolveAccountDto } from './dto/resolve-account.dto';
import { ValidateAccountDto } from './dto/validate-account.dto';
import { ListBanksDto } from './dto/list-banks.dto';
import { CreateTransferRecipientDto } from './dto/create-transfer-recipient.dto';
import { ObjectId } from 'src/common/decorators';
import { Types } from 'mongoose';
import { InitiateTransferDto } from './dto/initiate-transfer.dto';
import { Request, Response } from 'express';
import { WebhookDto } from './dto/webhook.dto';

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

  // note: this route is provided for testing purposes only, the service is meant to be called from another module
  @UseGuards(UserGuard)
  @Get('/transaction/verify')
  verifyTransaction(@Query() query: VerifyTransactionDto) {
    return this.paystackService.verifyTransaction(query);
  }

  @UseGuards(UserGuard)
  @Post('/transfer-recipient')
  createTrasnferRecipient(
    @Req() req: UserPopulatedRequest,
    @Body() body: CreateTransferRecipientDto,
  ) {
    return this.paystackService.createTransferRecipient(req.user.id, body);
  }

  @UseGuards(UserGuard)
  @Get('/transfer-recipient')
  getTransferRecipients(@Req() req: UserPopulatedRequest) {
    return this.paystackService.getTransferRecipients(req.user.id);
  }

  @UseGuards(UserGuard)
  @Delete('/transfer-recipient/:id')
  deleteTransferRecipient(
    @Req() req: UserPopulatedRequest,
    @ObjectId() id: Types.ObjectId,
  ) {
    return this.paystackService.deleteTransferRecipient(req.user.id, id);
  }

  // note: this route is provided for testing purposes only, the service is meant to be called from another module
  @UseGuards(UserGuard)
  @Post('/transfer')
  initiateTransfer(
    @Req() req: UserPopulatedRequest,
    @Body() body: InitiateTransferDto,
  ) {
    return this.paystackService.initiateTransfer(req.user.id, body);
  }

  @UseGuards(UserGuard)
  @Get('/bank/resolve')
  resolveAccount(@Query() query: ResolveAccountDto) {
    return this.paystackService.resolveAccount(query);
  }

  @UseGuards(UserGuard)
  @Post('/bank/validate')
  validateAccount(@Body() body: ValidateAccountDto) {
    return this.paystackService.validateAccount(body);
  }

  @UseGuards(UserGuard)
  @Get('/bank')
  listBanks(@Query() query: ListBanksDto) {
    return this.paystackService.listBanks(query);
  }

  @Post('/webhook')
  webhook(@Req() req: Request, @Res() res: Response, @Body() body: WebhookDto) {
    return this.paystackService.webhook(req, res, body);
  }
}
