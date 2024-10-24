import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Config } from 'src/config';

@Injectable()
export class PaystackService {
  private readonly paystackApi: AxiosInstance;
  constructor(private readonly configService: ConfigService<Config, true>) {
    this.paystackApi = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.configService.get('paystack.secretKey', { infer: true })}`,
      },
    });
  }
}
