import { TramTicketEntity } from '../tram-ticket.entity';

describe('TramTicketEntity', () => {
  describe('constructor', () => {
    it('should create an instance with all properties set', () => {
      // Arrange & Act
      const ticket = new TramTicketEntity('Central Station', 'Museum Square', '13');

      // Assert
      expect(ticket).toBeDefined();
      expect(ticket.from).toBe('Central Station');
      expect(ticket.to).toBe('Museum Square');
      expect(ticket.lineNumber).toBe('13');
      expect(ticket.kind).toBe('tram');
    });
  });

  describe('toHumanString', () => {
    it('should return a human-readable description', () => {
      // Arrange
      const ticket = new TramTicketEntity('Central Station', 'Museum Square', '13');

      // Act
      const result = ticket.toHumanString();

      // Assert
      expect(result).toBe('Board the Tram 13 from Central Station to Museum Square.');
    });
  });
});
