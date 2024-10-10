import { Module } from '@nestjs/common';
import { AwsLocationService } from './aws-location.service';

@Module({
  providers: [AwsLocationService],
  exports: [AwsLocationService],
})
export class AwsLocationModule {}
