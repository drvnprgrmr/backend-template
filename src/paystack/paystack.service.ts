import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config, PaystackConfig } from 'src/config';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';
import { Model, Types } from 'mongoose';
import { PaystackTransaction } from './schemas/paystack-transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { PaystackTransactionStatus } from './enums/paystack-transaction-status.enum';
import { UserService } from 'src/user/user.service';
import { ResolveAccountDto } from './dto/resolve-account.dto';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly paystackApi: AxiosInstance;
  private readonly paystackConfig: PaystackConfig;

  constructor(
    private readonly configService: ConfigService<Config, true>,
    @InjectModel(PaystackTransaction.name)
    private readonly paystackTransactionModel: Model<PaystackTransaction>,
    private readonly userService: UserService,
  ) {
    this.paystackConfig = this.configService.get('paystack', { infer: true });
    this.paystackApi = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.paystackConfig.secretKey}`,
      },
    });
  }

  async initializeTransaction(
    userId: Types.ObjectId,
    dto: InitializeTransactionDto,
  ) {
    const { amount } = dto;

    const user = await this.userService.userModel.findById(userId).exec();

    const paystackTransaction = await this.paystackTransactionModel.create({
      user: userId,
      amount,
    });

    let response: AxiosResponse;
    try {
      response = await this.paystackApi.post('/transaction/initialize', {
        ...dto,
        email: user.email.value,
        callback_url: this.paystackConfig.callbackUrl,
        reference: paystackTransaction.id,
      });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error initializing paystack transaction.',
      });
    }

    return {
      message: 'Transaction initialized.',
      data: { ...response.data.data },
    };
  }

  // note: this should be called from another service and the return of success means value can be provided
  async verifyTransaction(dto: VerifyTransactionDto) {
    this.logger.debug('verify transaction');

    const { reference } = dto;

    const paystackTransaction = await this.paystackTransactionModel
      .findById(reference)
      .exec();

    if (!paystackTransaction)
      throw new NotFoundException({
        message: 'Paystack transaction not found.',
      });

    let response: AxiosResponse;
    try {
      response = await this.paystackApi.get(`/transaction/verify/${reference}`);
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error verifying paystack transaction.',
      });
    }

    paystackTransaction.status = response.data.data.status;
    paystackTransaction.currency = response.data.data.currency;
    paystackTransaction.transactionId = response.data.data.id;

    await paystackTransaction.save();

    if (
      response.data.data.status === PaystackTransactionStatus.SUCCESS &&
      response.data.data.amount === paystackTransaction.amount
    ) {
      return { status: 'success', message: 'Transaction successful.' };
    } else {
      return { status: 'fail', message: 'Transaction unsuccessful.' };
    }
  }

  async resolveAccount(dto: ResolveAccountDto) {
    let response: AxiosResponse;
    try {
      response = await this.paystackApi.get('/bank/resolve', { params: dto });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error resolving account.',
      });
    }

    return { message: 'Account resolved', data: response.data.data };
  }
}
