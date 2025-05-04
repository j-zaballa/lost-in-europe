import { ALLOWED_LUGGAGE_METHODS, LUGGAGE_CHECK_IN_METHODS, PlaneTicketEntity } from '../plane-ticket.entity';

describe('PlaneTicketEntity', () => {
  describe('constants', () => {
    it('should define luggage check-in methods', () => {
      expect(LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN).toBe('self-check-in');
      expect(LUGGAGE_CHECK_IN_METHODS.AUTOMATIC).toBe('automatic');
    });

    it('should expose allowed luggage methods', () => {
      expect(ALLOWED_LUGGAGE_METHODS).toEqual(['self-check-in', 'automatic']);
    });
  });

  describe('constructor', () => {
    it('should create an instance with all properties set', () => {
      // Arrange & Act
      const ticket = new PlaneTicketEntity('Rome', 'Amsterdam', 'AF-1234', '12C', 'B22', 'self-check-in');

      // Assert
      expect(ticket).toBeDefined();
      expect(ticket.from).toBe('Rome');
      expect(ticket.to).toBe('Amsterdam');
      expect(ticket.flightNumber).toBe('AF-1234');
      expect(ticket.seat).toBe('12C');
      expect(ticket.gate).toBe('B22');
      expect(ticket.luggage).toBe('self-check-in');
      expect(ticket.kind).toBe('plane');
    });
  });

  describe('toHumanString', () => {
    it('should return a description with self check-in luggage', () => {
      // Arrange
      const ticket = new PlaneTicketEntity('Rome', 'Amsterdam', 'AF-1234', '12C', 'B22', 'self-check-in');

      // Act
      const result = ticket.toHumanString();

      // Assert
      expect(result).toBe(
        'From Rome, board the flight AF-1234 to Amsterdam from gate B22, seat 12C. Self-check-in luggage at counter.',
      );
    });

    it('should return a description with automatic luggage transfer', () => {
      // Arrange
      const ticket = new PlaneTicketEntity('Rome', 'Amsterdam', 'AF-1234', '12C', 'B22', 'automatic');

      // Act
      const result = ticket.toHumanString();

      // Assert
      expect(result).toBe(
        'From Rome, board the flight AF-1234 to Amsterdam from gate B22, seat 12C. Luggage will transfer automatically from the last flight.',
      );
    });
  });

  describe('getLuggageDescription', () => {
    it('should return description for automatic luggage', () => {
      // Arrange
      const ticket = new PlaneTicketEntity('Rome', 'Amsterdam', 'AF-1234', '12C', 'B22', 'automatic');

      // Act
      // @ts-ignore - accessing private method for testing
      const result = ticket.getLiggageDescription();

      // Assert
      expect(result).toBe('Luggage will transfer automatically from the last flight');
    });

    it('should return description for self check-in luggage', () => {
      // Arrange
      const ticket = new PlaneTicketEntity('Rome', 'Amsterdam', 'AF-1234', '12C', 'B22', 'self-check-in');

      // Act
      // @ts-ignore - accessing private method for testing
      const result = ticket.getLiggageDescription();

      // Assert
      expect(result).toBe('Self-check-in luggage at counter');
    });
  });
});
