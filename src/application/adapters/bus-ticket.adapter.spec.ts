import { Test, TestingModule } from '@nestjs/testing';
import { BusTicketAdapter } from './bus-ticket.adapter';

describe('BusTicketAdapter', () => {
  let provider: BusTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusTicketAdapter],
    }).compile();

    provider = module.get<BusTicketAdapter>(BusTicketAdapter);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
