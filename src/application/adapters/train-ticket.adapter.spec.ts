import { Test, TestingModule } from '@nestjs/testing';
import { TrainTicketAdapter } from './train-ticket.adapter';

describe('TrainTicketAdapter', () => {
  let provider: TrainTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainTicketAdapter],
    }).compile();

    provider = module.get<TrainTicketAdapter>(TrainTicketAdapter);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
