import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import * as fs from 'node:fs/promises';
import { ReadStream } from 'fs';
import { AwsCloudfrontService } from 'src/aws/aws-cloudfront/aws-cloudfront.service';
import { AwsConfig, Config } from 'src/config';

export interface CreateObjectOptions {
  key: string;
  body: ReadStream;
  meta: {
    length?: number;
    mimetype?: string;
  };
}

export interface UploadFileOptions {
  path: string;
  key: string;
  length: number;
  mimetype: string;
}

@Injectable()
export class AwsS3Service {
  private readonly logger: Logger = new Logger(AwsS3Service.name);
  private readonly client: S3Client;
  private readonly awsConfig: AwsConfig;

  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly awsCloudfrontService: AwsCloudfrontService,
  ) {
    const awsConfig = this.configService.get('aws', { infer: true });

    this.client = new S3Client({ region: awsConfig.region });
  }

  async createObject(options: CreateObjectOptions) {
    const { key, body, meta } = options;

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.awsConfig.s3.bucketName,
        Key: key,
        Body: body,
        ContentType: meta?.mimetype,
        ContentLength: meta?.length,
      },
    });

    return await upload.done();
  }

  async uploadFile(
    options: UploadFileOptions,
    performInvalidation: boolean = true,
  ) {
    const { path, key, length, mimetype } = options;

    const file = await fs.open(path);
    const stream = file.createReadStream();

    if (performInvalidation)
      await this.awsCloudfrontService.invalidatePath('/' + key);

    const response = await this.createObject({
      key,
      body: stream,
      meta: {
        length,
        mimetype,
      },
    });

    await file.close();
    await fs.unlink(path);

    const url = this.awsCloudfrontService.getUrl(key);
    this.logger.debug(response, url);
    return url;
  }
}
