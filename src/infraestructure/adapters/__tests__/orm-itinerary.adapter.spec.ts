import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryEntity as ItineraryDomain } from 'src/domain/entities/itinerary.entity';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { ItineraryEntity as ItineraryOrm } from '../../database/entities/itinerary.entity';
import { TicketEntity as TicketOrm } from '../../database/entities/ticket.entity';
import { OrmItineraryAdapter } from '../orm-itinerary.adapter';
import { OrmTicketAdapter } from '../orm-ticket.adapter';

// Mock UUID generation to prevent random IDs in tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('OrmItineraryAdapter', () => {
  let adapter: OrmItineraryAdapter;
  let ticketAdapter: jest.Mocked<OrmTicketAdapter>;

  beforeEach(async () => {
    const mockTicketAdapter = {
      adaptToDomain: jest.fn(),
      adaptToOrm: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrmItineraryAdapter,
        {
          provide: OrmTicketAdapter,
          useValue: mockTicketAdapter,
        },
      ],
    }).compile();

    adapter = module.get<OrmItineraryAdapter>(OrmItineraryAdapter);
    ticketAdapter = module.get<OrmTicketAdapter>(OrmTicketAdapter) as jest.Mocked<OrmTicketAdapter>;
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('adaptToDomain', () => {
    it('should convert an ORM itinerary to a domain itinerary', () => {
      // Arrange
      const mockOrmTicket1 = new TicketOrm();
      mockOrmTicket1.kind = 'train';
      mockOrmTicket1.from = 'A';
      mockOrmTicket1.to = 'B';

      const mockOrmTicket2 = new TicketOrm();
      mockOrmTicket2.kind = 'bus';
      mockOrmTicket2.from = 'B';
      mockOrmTicket2.to = 'C';

      const mockOrmItinerary = new ItineraryOrm();
      mockOrmItinerary.id = 'test-id-123';
      mockOrmItinerary.tickets = [mockOrmTicket1, mockOrmTicket2];

      const mockDomainTicket1 = {
        kind: 'train',
        from: 'A',
        to: 'B',
      } as TicketEntity;

      const mockDomainTicket2 = {
        kind: 'bus',
        from: 'B',
        to: 'C',
      } as TicketEntity;

      ticketAdapter.adaptToDomain.mockReturnValueOnce(mockDomainTicket1).mockReturnValueOnce(mockDomainTicket2);

      // Act
      const result = adapter.adaptToDomain(mockOrmItinerary);

      // Assert
      expect(result).toBeInstanceOf(ItineraryDomain);
      expect(result.id).toBe('test-id-123');
      expect(result.tickets).toHaveLength(2);
      expect(ticketAdapter.adaptToDomain).toHaveBeenCalledTimes(2);
      expect(ticketAdapter.adaptToDomain).toHaveBeenCalledWith(mockOrmTicket1);
      expect(ticketAdapter.adaptToDomain).toHaveBeenCalledWith(mockOrmTicket2);
    });

    it('should handle itinerary without tickets', () => {
      // Arrange
      const mockOrmItinerary = new ItineraryOrm();
      mockOrmItinerary.id = 'test-id-123';
      mockOrmItinerary.tickets = [];

      // Act
      const result = adapter.adaptToDomain(mockOrmItinerary);

      // Assert
      expect(result).toBeInstanceOf(ItineraryDomain);
      expect(result.id).toBe('test-id-123');
      expect(result.tickets).toHaveLength(0);
      expect(ticketAdapter.adaptToDomain).not.toHaveBeenCalled();
    });

    it('should handle itinerary with undefined tickets', () => {
      // Arrange
      const mockOrmItinerary = new ItineraryOrm();
      mockOrmItinerary.id = 'test-id-123';
      // TypeScript doesn't allow null assignment for tickets property
      // @ts-expect-error Testing undefined tickets scenario
      mockOrmItinerary.tickets = undefined;

      // Act
      const result = adapter.adaptToDomain(mockOrmItinerary);

      // Assert
      expect(result).toBeInstanceOf(ItineraryDomain);
      expect(result.id).toBe('test-id-123');
      expect(result.tickets).toHaveLength(0);
      expect(ticketAdapter.adaptToDomain).not.toHaveBeenCalled();
    });
  });

  describe('adaptToOrm', () => {
    it('should convert a domain itinerary to an ORM itinerary', () => {
      // Arrange
      const mockTicket = {
        kind: 'train',
        from: 'A',
        to: 'B',
      } as TicketEntity;

      const mockDomainItinerary = new ItineraryDomain([mockTicket], 'test-id-123');

      // Act
      const result = adapter.adaptToOrm(mockDomainItinerary);

      // Assert
      expect(result).toBeInstanceOf(ItineraryOrm);
      expect(result.id).toBe('test-id-123');
      // Note: tickets are handled separately, so they shouldn't be set here
      expect(result.tickets).toBeUndefined();
    });

    it('should handle domain itinerary without ID', () => {
      // Arrange
      const mockTicket = {
        kind: 'train',
        from: 'A',
        to: 'B',
      } as TicketEntity;

      // When no ID is provided to the constructor, it will generate a UUID
      // We've mocked uuid.v4 to return 'mocked-uuid'
      const mockDomainItinerary = new ItineraryDomain([mockTicket]);

      // Act
      const result = adapter.adaptToOrm(mockDomainItinerary);

      // Assert
      expect(result).toBeInstanceOf(ItineraryOrm);
      expect(result.id).toBe('mocked-uuid');
    });
  });
});
