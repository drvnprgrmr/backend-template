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
import { Transaction } from './schemas/transaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { TransactionStatus } from './enums/transaction-status.enum';
import { UserService } from 'src/user/user.service';
import { ResolveAccountDto } from './dto/resolve-account.dto';
import { ValidateAccountDto } from './dto/validate-account.dto';
import { ListBanksDto } from './dto/list-banks.dto';
import { CreateTransferRecipientDto } from './dto/create-transfer-recipient.dto';
import { TransferRecipient } from './schemas/transfer-recipient.schema';
import { ApiResponse } from 'src/common/interfaces';
import { InitiateTransferDto } from './dto/initiate-transfer.dto';
import { Currency } from './enums/currency.enum';
import { Transfer } from './schemas/transfer.schema';
import { UserDocument } from 'src/user/schemas/user.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { Customer } from './schemas/customer.schema';

/**
 * note: all these service functions are meant to be as generic as possible
 * as a result some things like wallet balances for users are not taken into account
 */

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly api: AxiosInstance;
  private readonly config: PaystackConfig;

  constructor(
    private readonly configService: ConfigService<Config, true>,

    @InjectModel(Transfer.name)
    private readonly transferModel: Model<Transfer>,

    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,

    @InjectModel(TransferRecipient.name)
    private readonly transferRecipientModel: Model<TransferRecipient>,

    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,

    private readonly userService: UserService,
  ) {
    this.config = this.configService.get('paystack', { infer: true });
    this.api = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.config.secretKey}`,
      },
    });
  }

  @OnEvent('user:signup')
  async createCustomer(user: UserDocument) {
    const doc = {
      first_name: user.name?.first,
      last_name: user.name?.last,
      email: user.email?.value,
      phone: user.phone?.value,
    };

    let response: AxiosResponse;
    try {
      response = await this.api.post('/customer', doc);
    } catch (err) {
      return this.logger.error(
        'Error creating  customer',
        err.response.data.message,
      );
    }

    const { customer_code } = response.data.data;

    await this.customerModel.create({
      ...doc,
      user: user.id,
      customer_code,
    });

    this.logger.verbose(' customer created', customer_code);
  }

  async initializeTransaction(
    userId: Types.ObjectId,
    dto: InitializeTransactionDto,
  ) {
    const { amount } = dto;

    const user = await this.userService.userModel.findById(userId).exec();

    const Transaction = await this.transactionModel.create({
      user: userId,
      amount,
    });

    let response: AxiosResponse;
    try {
      response = await this.api.post('/transaction/initialize', {
        ...dto,
        email: user.email.value,
        callback_url: this.config.callbackUrl,
        reference: Transaction.id,
      });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error initializing  transaction.',
      });
    }

    return {
      message: ' transaction initialized.',
      data: { ...response.data.data },
    };
  }

  // note: this should be called from another service and the return of success means value can be provided
  async verifyTransaction(dto: VerifyTransactionDto) {
    this.logger.debug('verify transaction');

    const { reference } = dto;

    const Transaction = await this.transactionModel.findById(reference).exec();

    if (!Transaction)
      throw new NotFoundException({
        message: ' transaction not found.',
      });

    let response: AxiosResponse;
    try {
      response = await this.api.get(`/transaction/verify/${reference}`);
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error verifying  transaction.',
      });
    }

    Transaction.status = response.data.data.status;
    Transaction.currency = response.data.data.currency;
    Transaction.transactionId = response.data.data.id;

    await Transaction.save();

    if (
      response.data.data.status === TransactionStatus.SUCCESS &&
      response.data.data.amount === Transaction.amount
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
      await this.transferRecipientModel
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
      response = await this.api.post('/transferrecipient', {
        ...dto,
        name: user.fullName,
        email: user.email.value,
      });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error creating transfer recipient with .',
      });
    }

    const {
      recipient_code,
      details: { account_name, bank_name },
    } = response.data.data;

    this.logger.debug('transfer recipient responce data', response.data.data);

    const transferRecipient = await this.transferRecipientModel.create({
      user: userId,
      recipient_code,
      account_number,
      account_name,
      bank_code,
      bank_name,
      currency,
    });

    return {
      message: ' transfer recipient created.',
      data: { transferRecipient },
    };
  }

  async getTransferRecipients(userId: Types.ObjectId): Promise<ApiResponse> {
    const transferRecipients = await this.transferRecipientModel
      .find({
        user: userId,
      })
      .lean()
      .exec();

    return {
      message: "User's  transfer recipients fetched.",
      data: { transferRecipients },
    };
  }

  async deleteTransferRecipient(userId: Types.ObjectId, id: Types.ObjectId) {
    const transferRecipient = await this.transferRecipientModel
      .findOneAndDelete({
        _id: id,
        user: userId,
      })
      .exec();

    if (!transferRecipient)
      throw new BadRequestException({
        message: ' transfer recipient not found.',
      });

    try {
      await this.api.delete(
        `/transferrecipient/${transferRecipient.recipient_code}`,
      );
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error deleting transfer recipient from ',
      });
    }

    return {
      message: ' transfer recipient deleted successfully!',
      data: { transferRecipient },
    };
  }

  async initiateTransfer(userId: Types.ObjectId, dto: InitiateTransferDto) {
    const { recipient, amount, reason, currency } = dto;

    const balance = (await this.checkBalance(currency)) as number;

    if (balance - amount < this.config.minimumBalance)
      throw new BadRequestException(
        {
          message:
            'Transfer cannot be completed at this time.\nTry again later.',
        },
        { cause: `insuffient funds for currency: ${currency}` },
      );

    const transferRecipient = await this.transferRecipientModel.findOne({
      user: userId,
      recipient_code: recipient,
    });

    if (!transferRecipient)
      throw new BadRequestException({
        message: 'Transfer recipient does not exist.',
      });

    const Transfer = await this.transferModel.create({
      user: userId,
      transferRecipient: transferRecipient.id,
      amount,
      currency,
      reason,
    });

    try {
      await this.api.post('/transfer', {
        ...dto,
        reference: Transfer.id,
      });
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error initiating transfer.',
      });
    }

    return { message: 'Transfer initiated.', data: { Transfer } };
  }

  async retryTransfer() {}

  private async checkBalance(currency?: Currency) {
    let response: AxiosResponse;
    try {
      response = await this.api.get('/balance');
    } catch (err) {
      this.logger.error(err.response.data.message);
      throw new InternalServerErrorException({
        message: 'Error checking  balance.',
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
      response = await this.api.get('/bank/resolve', { params: dto });
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
      response = await this.api.post('/bank/validate', dto);
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
      response = await this.api.get('/bank', {
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
