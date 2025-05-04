import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryItineraryRepository } from './in-memory-itinerary-repository';

describe('InMemoryItineraryRepository', () => {
  let provider: InMemoryItineraryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryItineraryRepository],
    }).compile();

    provider = module.get<InMemoryItineraryRepository>(InMemoryItineraryRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
