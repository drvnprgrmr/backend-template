import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import * as fs from 'node:fs/promises';
import { ReadStream } from 'fs';
import { AwsConfig, Config } from 'src/config';
import { AwsCloudfrontService } from '../aws-cloudfront/aws-cloudfront.service';

export interface UploadFileOptions {
  path: string;
  key: string;
  length: number;
  mimetype: string;
  metadata?: Record<string, string>;
}

export interface CreateObjectOptions extends UploadFileOptions {
  body: ReadStream;
  file: fs.FileHandle;
}

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);
  private readonly awsConfig: AwsConfig;
  private readonly client: S3Client;

  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly awsCloudfrontService: AwsCloudfrontService,
  ) {
    this.awsConfig = this.configService.get('aws', { infer: true });
    this.client = new S3Client({ region: this.awsConfig.region });
  }

  createObject(options: CreateObjectOptions) {
    const { key, body, file, path, mimetype, length, metadata } = options;

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.awsConfig.s3.bucketName,
        Key: key,
        Body: body,
        ContentType: mimetype,
        ContentLength: length,
        Metadata: metadata,
      },
    });

    upload.done().then(async (result) => {
      await file.close();
      await fs.unlink(path);

      this.logger.verbose(result);
    });
  }

  async uploadFile(
    options: UploadFileOptions,
    performInvalidation: boolean = true,
  ) {
    const { path, key, length, mimetype, metadata } = options;

    const file = await fs.open(path);
    const stream = file.createReadStream();

    if (performInvalidation)
      await this.awsCloudfrontService.invalidatePath('/' + key);

    this.createObject({
      key,
      body: stream,
      file,
      path,
      length,
      mimetype,
      metadata,
    });

    return this.awsCloudfrontService.getUrl(key);
  }
}
