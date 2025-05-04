import { TrainTicketEntity } from '../train-ticket.entity';

describe('TrainTicketEntity', () => {
  describe('constructor', () => {
    it('should create an instance with all properties set', () => {
      // Arrange & Act
      const ticket = new TrainTicketEntity('London', 'Paris', 'TGV-9023', '5A', '42B');

      // Assert
      expect(ticket).toBeDefined();
      expect(ticket.from).toBe('London');
      expect(ticket.to).toBe('Paris');
      expect(ticket.trainNumber).toBe('TGV-9023');
      expect(ticket.platform).toBe('5A');
      expect(ticket.seat).toBe('42B');
      expect(ticket.kind).toBe('train');
    });
  });

  describe('toHumanString', () => {
    it('should return a human-readable description', () => {
      // Arrange
      const ticket = new TrainTicketEntity('London', 'Paris', 'TGV-9023', '5A', '42B');

      // Act
      const result = ticket.toHumanString();

      // Assert
      expect(result).toBe('Board train TGV-9023, Platform 5A from London to Paris. Seat number 42B.');
    });
  });
});
