import * as crypto from 'node:crypto';
import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { EnvironmentVariables } from './environment-variables';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const APP_NAME = 'template';
export const TMP_DIR = path.join(os.tmpdir(), APP_NAME);

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);
console.log('tmpdir', TMP_DIR);

const env = process.env as unknown as EnvironmentVariables;

export interface AwsConfig {
  region: string;
  s3: { bucketName: string };
  cloudfront: { baseUrl: string; distributionId: string };
  location: { indexName: string };
}

export interface PaystackConfig {
  publicKey: string;
  secretKey: string;
  callbackUrl?: string;
}

export interface Config {
  apiUrl: string;
  websiteUrl: string;
  isProduction: boolean;
  port: number;
  mongo: { uri: string };
  cors: { origin: string[] | string };
  jwt: { secret: string; issuer: string; audience: string; expiresIn: string };
  sendgrid: { apiKey: string };
  aws: AwsConfig;
  nubanApiKey: string;
  paystack: PaystackConfig;
}

export function configuration() {
  const apiUrl = 'https://api.template.com';
  const websiteUrl = 'https://template.com';

  const randomPort = crypto.randomInt(49_152, 65_535); // using 0 might be better;

  const nodeEnv = env.NODE_ENV ?? 'development';
  const isProduction = ['prod', 'production'].includes(nodeEnv?.trim());

  const corsOrigin = isProduction
    ? [websiteUrl, 'https://admin.socket.io']
    : '*';

  const config: Config = {
    apiUrl,
    websiteUrl,
    isProduction,
    port: env.PORT || randomPort,
    mongo: {
      uri: env.MONGO_URI || `mongodb://127.0.0.1:27017/${APP_NAME}`,
    },
    cors: {
      origin: corsOrigin,
    },
    jwt: {
      secret: env.JWT_SECRET || 'insecure',
      issuer: env.JWT_ISSUER || apiUrl,
      audience: env.JWT_AUDIENCE || websiteUrl,
      expiresIn: env.JWT_EXPIRES_IN || '30d',
    },
    sendgrid: { apiKey: env.SENDGRID_API_KEY },
    aws: {
      region: env.AWS_REGION || 'eu-north-1',
      s3: { bucketName: env.AWS_S3_BUCKET_NAME || 'test' },
      cloudfront: {
        baseUrl: env.AWS_CLOUDFRONT_BASE_URL,
        distributionId: env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
      },
      location: {
        indexName: env.AWS_LOCATION_INDEX_NAME,
      },
    },
    nubanApiKey: env.NUBAN_API_KEY,
    paystack: {
      publicKey: env.PAYSTACK_PUBLIC_KEY,
      secretKey: env.PAYSTACK_SECRET_KEY,
      callbackUrl: env.PAYSTACK_CALLBACK_URL,
    },
  };

  return config;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
