import { Test, TestingModule } from '@nestjs/testing';
import { HumanReadableService } from './human-readable.service';

describe('HumanReadableService', () => {
  let service: HumanReadableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HumanReadableService],
    }).compile();

    service = module.get<HumanReadableService>(HumanReadableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
