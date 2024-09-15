import * as crypto from 'crypto';

const env = process.env;

export interface AwsConfig {
  region: string;
  s3: { bucketName: string };
  cloudfront: { baseUrl: string; distributionId: string };
}

export interface Config {
  apiUrl: string;
  websiteUrl: string;
  isProduction: boolean;
  port: number;
  mongo: { uri: string };
  cors: { origin: string[] | string };
  jwt: { secret: string; issuer: string; audience: string; expiresIn: string };
  aws: AwsConfig;
}

export function configuration() {
  const appName = 'template';
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
    port: parseInt(env.PORT) || randomPort,
    mongo: {
      uri: env.MONGO_URI || `mongodb://127.0.0.1:27017/${appName}`,
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
    aws: {
      region: env.AWS_REGION || 'eu-north-1',
      s3: { bucketName: env.AWS_S3_BUCKET_NAME || 'test' },
      cloudfront: {
        baseUrl: env.AWS_CLOUDFRONT_BASE_URL,
        distributionId: env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
      },
    },
  };

  return config;
}
