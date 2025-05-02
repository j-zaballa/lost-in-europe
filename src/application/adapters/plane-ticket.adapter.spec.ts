import { Test, TestingModule } from '@nestjs/testing';
import { PlaneTicketAdapter } from './plane-ticket.adapter';

describe('PlaneTicketAdapter', () => {
  let provider: PlaneTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaneTicketAdapter],
    }).compile();

    provider = module.get<PlaneTicketAdapter>(PlaneTicketAdapter);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
