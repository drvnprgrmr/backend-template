import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { AwsConfig, Config } from 'src/config';

@Injectable()
export class AwsCloudfrontService {
  private readonly logger: Logger = new Logger(AwsCloudfrontService.name);
  private readonly client: CloudFrontClient;
  private readonly awsConfig: AwsConfig;

  constructor(private readonly configService: ConfigService<Config, true>) {
    this.awsConfig = this.configService.get('aws', { infer: true });

    this.client = new CloudFrontClient({
      region: this.awsConfig.region,
    });
  }

  getUrl(key: string) {
    return `${this.awsConfig.cloudfront.baseUrl}/${key}`;
  }

  async invalidatePath(path: string) {
    const command = new CreateInvalidationCommand({
      DistributionId: this.awsConfig.cloudfront.distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: { Quantity: 1, Items: [path] },
      },
    });

    const response = await this.client.send(command);
    this.logger.debug(response);

    return response;
  }
}
