import * as crypto from 'crypto';

export interface Config {
  apiUrl: string;
  websiteUrl: string;
  isProduction: boolean;
  port: number;
  mongo: { uri: string };
  cors: { origin: string[] | string };
  jwt: { secret: string; issuer: string; audience: string; expiresIn: string };
}

export function configuration() {
  const appName = 'template';
  const apiUrl = 'https://api.template.com';
  const websiteUrl = 'https://template.com';

  const randomPort = crypto.randomInt(49_152, 65_535); // using 0 might be better;

  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProduction = ['prod', 'production'].includes(nodeEnv?.trim());

  const corsOrigin = isProduction
    ? [websiteUrl, 'https://admin.socket.io']
    : '*';

  const config: Config = {
    apiUrl,
    websiteUrl,
    isProduction,
    port: parseInt(process.env.PORT) || randomPort,
    mongo: {
      uri: process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${appName}`,
    },
    cors: {
      origin: corsOrigin,
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'insecure',
      issuer: process.env.JWT_ISSUER || apiUrl,
      audience: process.env.JWT_AUDIENCE || websiteUrl,
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    },
  };

  return config;
}
