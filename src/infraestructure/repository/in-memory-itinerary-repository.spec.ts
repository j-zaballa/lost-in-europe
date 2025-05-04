import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { InMemoryItineraryRepository } from './in-memory-itinerary-repository';

describe('InMemoryItineraryRepository', () => {
  let repository: InMemoryItineraryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryItineraryRepository],
    }).compile();

    repository = module.get<InMemoryItineraryRepository>(InMemoryItineraryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save and findOne', () => {
    it('should save an itinerary and retrieve it by ID', async () => {
      // Arrange
      const mockTicket = {
        from: 'Paris',
        to: 'London',
        kind: 'train',
        toHumanString: jest.fn(),
      } as TicketEntity;

      const customId = 'test-id-123';
      const itinerary = new ItineraryEntity([mockTicket], customId);

      // Act
      await repository.save(itinerary);
      const result = await repository.findOne(customId);

      // Assert
      expect(result).toBe(itinerary);
    });

    it('should return undefined when finding an itinerary that does not exist', async () => {
      // Act & Assert
      const result = await repository.findOne('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should update an existing itinerary when saving with the same ID', async () => {
      // Arrange
      const mockTicket1 = {
        from: 'Paris',
        to: 'London',
        kind: 'train',
        toHumanString: jest.fn(),
      } as TicketEntity;

      const mockTicket2 = {
        from: 'London',
        to: 'Edinburgh',
        kind: 'train',
        toHumanString: jest.fn(),
      } as TicketEntity;

      const customId = 'test-id-123';
      const itinerary1 = new ItineraryEntity([mockTicket1], customId);
      const itinerary2 = new ItineraryEntity([mockTicket2], customId);

      // Act
      await repository.save(itinerary1);
      await repository.save(itinerary2); // Should overwrite the previous one
      const result = await repository.findOne(customId);

      // Assert
      expect(result).toBe(itinerary2);
      expect(result).not.toBe(itinerary1);
      expect(result?.tickets[0]).toBe(mockTicket2);
    });
  });
});
