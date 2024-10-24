import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Config, PaystackConfig } from 'src/config';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly paystackApi: AxiosInstance;
  private readonly paystackConfig: PaystackConfig;

  constructor(private readonly configService: ConfigService<Config, true>) {
    this.paystackConfig = this.configService.get('paystack', { infer: true });
    this.paystackApi = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.paystackConfig.secretKey}`,
      },
    });
  }

  async initializeTransaction(dto: InitializeTransactionDto) {
    const { status, data } = await this.paystackApi.post(
      '/transaction/initialize',
      {
        ...dto,
        callback_url: this.paystackConfig.callbackUrl,
      },
    );

    if (status !== 200) this.logger.error(data.message);

    const { authorization_url, access_code, reference } = data.data;

    this.logger.debug(data);

    return {
      message: 'Transaction initialized.',
      data: { authorization_url, access_code },
    };
  }
}
