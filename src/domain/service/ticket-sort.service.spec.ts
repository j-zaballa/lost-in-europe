import { Test, TestingModule } from '@nestjs/testing';
import { TicketSortService } from './ticket-sort.service';

describe('TicketSortService', () => {
  let service: TicketSortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketSortService],
    }).compile();

    service = module.get<TicketSortService>(TicketSortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
