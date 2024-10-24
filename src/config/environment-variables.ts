import {
  IsEnum,
  IsNumber,
  IsOptional,
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
  @IsOptional()
  MONGO_URI: string;

  @Matches(/^(?=SG\.)\S{69}$/)
  SENDGRID_API_KEY: string;

  @Min(8)
  @IsString()
  @IsOptional()
  JWT_SECRET: string;

  @IsUrl()
  @IsOptional()
  JWT_ISSUER: string;

  @IsUrl()
  @IsOptional()
  JWT_AUDIENCE: string;

  @Matches(/^\d+[shd]?$/)
  @IsOptional()
  JWT_EXPIRES_IN: string;

  @IsEnum(AwsRegion)
  AWS_REGION: string;

  @Matches(/^[\w.-]{3,63}$/)
  AWS_S3_BUCKET_NAME: string;

  @Matches(/^https:\/\/\w+\.cloudfront.net$/) // note: using custom subdomain of the app might be better
  AWS_CLOUDFRONT_BASE_URL: string;

  @IsUppercase()
  AWS_CLOUDFRONT_DISTRIBUTION_ID: string;

  @IsString()
  AWS_LOCATION_INDEX_NAME: string;

  @IsString()
  NUBAN_API_KEY: string;

  @IsString()
  PAYSTACK_PUBLIC_KEY: string;

  @IsString()
  PAYSTACK_SECRET_KEY: string;

  @IsUrl()
  @IsOptional()
  PAYSTACK_CALLBACK_URL: string;
}
