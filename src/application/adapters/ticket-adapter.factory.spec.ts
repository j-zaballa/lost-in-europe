import { Test, TestingModule } from '@nestjs/testing';
import { TicketAdapterFactory } from './ticket-adapter.factory';

describe('TicketAdapterFactory', () => {
  let provider: TicketAdapterFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketAdapterFactory],
    }).compile();

    provider = module.get<TicketAdapterFactory>(TicketAdapterFactory);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
