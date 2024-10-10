import { Test, TestingModule } from '@nestjs/testing';
import { AwsLocationService } from './aws-location.service';

describe('AwsLocationService', () => {
  let service: AwsLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsLocationService],
    }).compile();

    service = module.get<AwsLocationService>(AwsLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
