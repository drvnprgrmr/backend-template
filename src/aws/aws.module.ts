import { Module } from '@nestjs/common';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { AwsCloudfrontModule } from './aws-cloudfront/aws-cloudfront.module';
import { AwsS3Service } from './aws-s3/aws-s3.service';
import { AwsCloudfrontService } from './aws-cloudfront/aws-cloudfront.service';
import { AwsSesModule } from './aws-ses/aws-ses.module';
import { AwsLocationModule } from './aws-location/aws-location.module';
import { AwsSesService } from './aws-ses/aws-ses.service';
import { AwsLocationService } from './aws-location/aws-location.service';

const provideAndExport = [
  AwsS3Service,
  AwsCloudfrontService,
  AwsSesService,
  AwsLocationService,
];

@Module({
  imports: [AwsS3Module, AwsCloudfrontModule, AwsSesModule, AwsLocationModule],
  providers: provideAndExport,
  exports: provideAndExport,
})
export class AwsModule {}
