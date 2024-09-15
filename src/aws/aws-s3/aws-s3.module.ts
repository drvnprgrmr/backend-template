import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsCloudfrontModule } from 'src/aws/aws-cloudfront/aws-cloudfront.module';

@Module({
  imports: [AwsCloudfrontModule],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
