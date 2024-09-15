import { Module } from '@nestjs/common';
import { AwsCloudfrontService } from './aws-cloudfront.service';

@Module({
  providers: [AwsCloudfrontService],
  exports: [AwsCloudfrontService],
})
export class AwsCloudfrontModule {}
