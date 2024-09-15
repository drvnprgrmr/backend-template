import { Test, TestingModule } from '@nestjs/testing';
import { AwsCloudfrontService } from './aws-cloudfront.service';

describe('AwsCloudfrontService', () => {
  let service: AwsCloudfrontService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsCloudfrontService],
    }).compile();

    service = module.get<AwsCloudfrontService>(AwsCloudfrontService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
