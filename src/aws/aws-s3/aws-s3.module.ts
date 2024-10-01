import { Module } from '@nestjs/common';
import { AwsCloudfrontModule } from '../aws-cloudfront/aws-cloudfront.module';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [AwsCloudfrontModule],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
