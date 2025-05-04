import { BusTicketEntity } from '../bus-ticket.entity';

describe('BusTicketEntity', () => {
  describe('constructor', () => {
    it('should create an instance with required properties', () => {
      // Arrange & Act
      const ticket = new BusTicketEntity('Berlin', 'Munich', 'BUS-123');

      // Assert
      expect(ticket).toBeDefined();
      expect(ticket.from).toBe('Berlin');
      expect(ticket.to).toBe('Munich');
      expect(ticket.busCode).toBe('BUS-123');
      expect(ticket.kind).toBe('bus');
      expect(ticket.seat).toBeUndefined();
    });

    it('should create an instance with optional seat property', () => {
      // Arrange & Act
      const ticket = new BusTicketEntity('Berlin', 'Munich', 'BUS-123', '15D');

      // Assert
      expect(ticket).toBeDefined();
      expect(ticket.from).toBe('Berlin');
      expect(ticket.to).toBe('Munich');
      expect(ticket.busCode).toBe('BUS-123');
      expect(ticket.seat).toBe('15D');
    });
  });

  describe('toHumanString', () => {
    it('should return a description without seat when not assigned', () => {
      // Arrange
      const ticket = new BusTicketEntity('Berlin', 'Munich', 'BUS-123');

      // Act
      const result = ticket.toHumanString();

      // Assert
      expect(result).toBe('Board the BUS-123 bus from Berlin to Munich. No seat assignment.');
    });

    it('should return a description with seat when assigned', () => {
      // Arrange
      const ticket = new BusTicketEntity('Berlin', 'Munich', 'BUS-123', '15D');

      // Act
      const result = ticket.toHumanString();

      // Assert
      expect(result).toBe('Board the BUS-123 bus from Berlin to Munich. Seat 15D.');
    });
  });

  describe('getSeatDescription', () => {
    it('should return seat description when seat is provided', () => {
      // Arrange
      const ticket = new BusTicketEntity('Berlin', 'Munich', 'BUS-123', '15D');

      // Act
      // @ts-expect-error - accessing private method for testing
      const result = ticket.getSeatDescription();

      // Assert
      expect(result).toBe('Seat 15D');
    });

    it('should return no assignment message when seat is not provided', () => {
      // Arrange
      const ticket = new BusTicketEntity('Berlin', 'Munich', 'BUS-123');

      // Act
      // @ts-expect-error - accessing private method for testing
      const result = ticket.getSeatDescription();

      // Assert
      expect(result).toBe('No seat assignment');
    });
  });
});
