import { ItineraryEntity } from '../itinerary.entity';
import { TicketEntity } from '../ticket-base.entity';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-uuid'),
}));

describe('ItineraryEntity', () => {
  // Create a global beforeEach to mock Date
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
  });

  // Restore after tests
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('constructor', () => {
    it('should create an instance with all properties and generate an ID if not provided', () => {
      // Arrange
      const mockTickets = [
        {
          from: 'A',
          to: 'B',
          kind: 'train',
          toHumanString: jest.fn(),
        } as TicketEntity,
        {
          from: 'B',
          to: 'C',
          kind: 'bus',
          toHumanString: jest.fn(),
        } as TicketEntity,
      ];

      // Act
      const itinerary = new ItineraryEntity(mockTickets);

      // Assert
      expect(itinerary).toBeDefined();
      expect(itinerary.id).toBe('mocked-uuid'); // Uses mocked UUID
      expect(itinerary.tickets).toBe(mockTickets);
      expect(itinerary.createdAt).toEqual(new Date('2024-01-01'));
    });

    it('should use the provided ID if one is given', () => {
      // Arrange
      const mockTickets = [
        {
          from: 'A',
          to: 'B',
          kind: 'train',
          toHumanString: jest.fn(),
        } as TicketEntity,
      ];
      const customId = 'custom-id-123';

      // Act
      const itinerary = new ItineraryEntity(mockTickets, customId);

      // Assert
      expect(itinerary.id).toBe(customId);
    });
  });

  describe('toHumanString', () => {
    it('should generate a human-readable string from tickets', () => {
      // Arrange
      const mockTicket1 = {
        from: 'A',
        to: 'B',
        kind: 'train',
        toHumanString: jest.fn().mockReturnValue('Take train from A to B'),
      } as TicketEntity;

      const mockTicket2 = {
        from: 'B',
        to: 'C',
        kind: 'bus',
        toHumanString: jest.fn().mockReturnValue('Take bus from B to C'),
      } as TicketEntity;

      const itinerary = new ItineraryEntity([mockTicket1, mockTicket2]);

      // Act
      const result = itinerary.toHumanString();

      // Assert
      expect(mockTicket1.toHumanString).toHaveBeenCalled();
      expect(mockTicket2.toHumanString).toHaveBeenCalled();
      expect(result).toBe(
        '0. Start.\n' + '1. Take train from A to B\n' + '2. Take bus from B to C\n' + '3. Last destination reached.',
      );
    });

    it('should handle empty tickets array', () => {
      // Arrange
      const itinerary = new ItineraryEntity([]);

      // Act
      const result = itinerary.toHumanString();

      // Assert
      expect(result).toBe('0. Start.\n' + '1. Last destination reached.');
    });
  });
});
