import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseMessagingService } from './firebase-messaging.service';

describe('FirebaseMessagingService', () => {
  let service: FirebaseMessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseMessagingService],
    }).compile();

    service = module.get<FirebaseMessagingService>(FirebaseMessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
