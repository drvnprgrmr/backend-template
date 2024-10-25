import {
  BadRequestException,
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
import { ValidateAccountDto } from './dto/validate-account.dto';
import { ListBanksDto } from './dto/list-banks.dto';
import { CreateTransferRecipientDto } from './dto/create-transfer-recipient.dto';
import { PaystackTransferRecipient } from './schemas/paystack-transfer-recipient.schema';
import { ApiResponse } from 'src/common/interfaces';
import { InitiateTransferDto } from './dto/initiate-transfer.dto';
import { PaystackCurrency } from './enums/paystack-currency.enum';
import { PaystackTransfer } from './schemas/paystack-transfer.schema';

/**
 * note: all these service functions are meant to be as generic as possible
 * as a result some things like wallet balances for users are not taken into account
 */

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly paystackApi: AxiosInstance;
  private readonly paystackConfig: PaystackConfig;

  constructor(
    private readonly configService: ConfigService<Config, true>,

    @InjectModel(PaystackTransfer.name)
    private readonly paystackTransferModel: Model<PaystackTransfer>,

    @InjectModel(PaystackTransaction.name)
    private readonly paystackTransactionModel: Model<PaystackTransaction>,

    @InjectModel(PaystackTransferRecipient.name)
    private readonly paystackTransferRecipientModel: Model<PaystackTransferRecipient>,

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

  // note: should be called on user signup event
  async createCustomer() {}

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
      message: 'Paystack transaction initialized.',
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

  async createTransferRecipient(
    userId: Types.ObjectId,
    dto: CreateTransferRecipientDto,
  ) {
    const user = await this.userService.userModel.findById(userId).exec();

    const { account_number, bank_code, currency } = dto;

    if (
      await this.paystackTransferRecipientModel
        .findOne({
          user: userId,
          account_number,
        })
        .exec()
    )
      throw new BadRequestException({
        message: 'Account already exists for user.',
      });

    let response: AxiosResponse;
    try {
      response = await this.paystackApi.post('/transferrecipient', {
        ...dto,
        name: user.fullName,
        email: user.email.value,
      });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error creating transfer recipient with paystack.',
      });
    }

    const {
      recipient_code,
      details: { account_name, bank_name },
    } = response.data.data;

    this.logger.debug('transfer recipient responce data', response.data.data);

    const paystackTransferRecipient =
      await this.paystackTransferRecipientModel.create({
        user: userId,
        recipient_code,
        account_number,
        account_name,
        bank_code,
        bank_name,
        currency,
      });

    return {
      message: 'Paystack transfer recipient created.',
      data: { paystackTransferRecipient },
    };
  }

  async getTransferRecipients(userId: Types.ObjectId): Promise<ApiResponse> {
    const paystackTransferRecipients = await this.paystackTransferRecipientModel
      .find({ user: userId })
      .lean()
      .exec();

    return {
      message: "User's paystack transfer recipients fetched.",
      data: { paystackTransferRecipients },
    };
  }

  async deleteTransferRecipient(userId: Types.ObjectId, id: Types.ObjectId) {
    const paystackTransferRecipient = await this.paystackTransferRecipientModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();

    if (!paystackTransferRecipient)
      throw new BadRequestException({
        message: 'Paystack transfer recipient not found.',
      });

    try {
      await this.paystackApi.delete(
        `/transferrecipient/${paystackTransferRecipient.recipient_code}`,
      );
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error deleting transfer recipient from paystack',
      });
    }

    return {
      message: 'Paystack transfer recipient deleted successfully!',
      data: { paystackTransferRecipient },
    };
  }

  async initiateTransfer(userId: Types.ObjectId, dto: InitiateTransferDto) {
    const { recipient, amount, reason, currency } = dto;

    const balance = (await this.checkBalance(currency)) as number;

    if (balance - amount < this.paystackConfig.minimumBalance)
      throw new BadRequestException(
        {
          message:
            'Transfer cannot be completed at this time.\nTry again later.',
        },
        { cause: `insuffient funds for currency: ${currency}` },
      );

    const paystackTransferRecipient =
      await this.paystackTransferRecipientModel.findOne({
        user: userId,
        recipient_code: recipient,
      });

    if (!paystackTransferRecipient)
      throw new BadRequestException({
        message: 'Transfer recipient does not exist.',
      });

    const paystackTransfer = await this.paystackTransferModel.create({
      user: userId,
      transferRecipient: paystackTransferRecipient.id,
      amount,
      currency,
      reason,
    });

    try {
      await this.paystackApi.post('/transfer', {
        ...dto,
        reference: paystackTransfer.id,
      });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error initiating transfer.',
      });
    }

    return { message: 'Transfer initiated.', data: { paystackTransfer } };
  }

  async retryTransfer() {}

  private async checkBalance(currency?: PaystackCurrency) {
    let response: AxiosResponse;
    try {
      response = await this.paystackApi.get('/balance');
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error checking paystack balance.',
      });
    }

    const results: { currency: string; balance: number }[] = response.data.data;

    this.logger.debug(results);

    if (!currency) return results;

    const balance = results.find(
      (result) => result.currency === currency,
    ).balance;

    return balance;
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

  async validateAccount(dto: ValidateAccountDto) {
    let response: AxiosResponse;
    try {
      response = await this.paystackApi.post('/bank/validate', dto);
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error validating account.',
      });
    }

    return { message: 'Account validated', data: response.data.data };
  }

  async listBanks(dto: ListBanksDto) {
    let response: AxiosResponse;
    try {
      response = await this.paystackApi.get('/bank', {
        params: { ...dto, use_cursor: true },
      });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error listing banks.',
      });
    }

    return {
      message: 'Banks retrieved',
      data: { banks: response.data.data, ...response.data.meta },
    };
  }

  async webhook() {}
}
