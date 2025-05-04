import { TicketEntity } from '../ticket-base.entity';

// Since TicketEntity is abstract, we need a concrete implementation for testing
class TestTicketEntity extends TicketEntity {
  readonly kind = 'test';

  constructor(from: string, to: string) {
    super(from, to);
  }

  toHumanString(): string {
    return `Test ticket from ${this.from} to ${this.to}`;
  }
}

describe('TicketEntity', () => {
  describe('constructor', () => {
    it('should create an instance with from and to properties', () => {
      // Arrange & Act
      const ticket = new TestTicketEntity('London', 'Paris');

      // Assert
      expect(ticket).toBeDefined();
      expect(ticket.from).toBe('London');
      expect(ticket.to).toBe('Paris');
    });
  });

  describe('properties', () => {
    it('should have a kind property', () => {
      // Arrange & Act
      const ticket = new TestTicketEntity('London', 'Paris');

      // Assert
      expect(ticket.kind).toBe('test');
    });
  });

  describe('toHumanString', () => {
    it('should return a human-readable string', () => {
      // Arrange
      const ticket = new TestTicketEntity('London', 'Paris');

      // Act
      const result = ticket.toHumanString();

      // Assert
      expect(result).toBe('Test ticket from London to Paris');
    });
  });
});
