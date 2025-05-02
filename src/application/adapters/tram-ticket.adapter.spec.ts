import { Test, TestingModule } from '@nestjs/testing';
import { TramTicketAdapter } from './tram-ticket.adapter';

describe('TramTicketAdapter', () => {
  let provider: TramTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TramTicketAdapter],
    }).compile();

    provider = module.get<TramTicketAdapter>(TramTicketAdapter);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
