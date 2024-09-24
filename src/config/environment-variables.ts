import {
  IsEnum,
  IsNumber,
  IsString,
  IsUppercase,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { AwsRegion, NodeEnv } from 'src/common/enums';

export class EnvironmentVariables {
  @Max(65535)
  @Min(0)
  @IsNumber()
  PORT: number;

  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsUrl({ protocols: ['mongo', 'mongodb+srv'], require_protocol: true })
  MONGO_URI: string;

  @Matches(/^(?=SG\.)\S{69}$/)
  SENDGRID_API_KEY: string;

  @Min(8)
  @IsString()
  JWT_SECRET: string;

  @IsUrl()
  JWT_ISSUER: string;

  @IsUrl()
  JWT_AUDIENCE: string;

  @Matches(/^\d+[shd]?$/)
  JWT_EXPIRES_IN: string;

  @IsEnum(AwsRegion)
  AWS_REGION: string;

  @Matches(/^[\w.-]{3,63}$/)
  AWS_S3_BUCKET_NAME: string;

  @Matches(/^https:\/\/\w+\.cloudfront.net\/$/) // note: using custom subdomain of the app might be better
  AWS_CLOUDFRONT_BASE_URL: string;

  @IsUppercase()
  AWS_CLOUDFRONT_DISTRIBUTION_ID: string;
}
