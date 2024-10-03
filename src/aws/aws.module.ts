import { Module } from '@nestjs/common';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AwsCloudfrontModule } from './aws-cloudfront/aws-cloudfront.module';
import { AwsS3Service } from './aws-s3/aws-s3.service';
import { AwsCloudfrontService } from './aws-cloudfront/aws-cloudfront.service';
import { AwsSesModule } from './aws-ses/aws-ses.module';

@Module({
  imports: [AwsS3Module, AwsCloudfrontModule, AwsSesModule],
  providers: [AwsS3Service, AwsCloudfrontService],
  exports: [AwsS3Service, AwsCloudfrontService],
})
export class AwsModule {}
