import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItineraryEntity as ItineraryDomain } from 'src/domain/entities/itinerary.entity';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { OrmItineraryAdapter } from 'src/infraestructure/adapters/orm-itinerary.adapter';
import { OrmTicketAdapter } from 'src/infraestructure/adapters/orm-ticket.adapter';
import { Repository } from 'typeorm';
import { ItineraryEntity as ItineraryEntityOrm } from '../../database/entities/itinerary.entity';
import { TicketEntity as TicketEntityOrm } from '../../database/entities/ticket.entity';
import { TypeOrmItineraryRepository } from '../type-orm-itinerary-repository';

describe('TypeOrmItineraryRepository', () => {
  let repository: TypeOrmItineraryRepository;
  let itineraryRepository: jest.Mocked<Repository<ItineraryEntityOrm>>;
  let ticketRepository: jest.Mocked<Repository<TicketEntityOrm>>;
  let ticketAdapter: jest.Mocked<OrmTicketAdapter>;
  let itineraryAdapter: jest.Mocked<OrmItineraryAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmItineraryRepository,
        {
          provide: getRepositoryToken(ItineraryEntityOrm),
          useValue: createMock<Repository<ItineraryEntityOrm>>(),
        },
        {
          provide: getRepositoryToken(TicketEntityOrm),
          useValue: createMock<Repository<TicketEntityOrm>>(),
        },
        {
          provide: OrmTicketAdapter,
          useValue: createMock<OrmTicketAdapter>(),
        },
        {
          provide: OrmItineraryAdapter,
          useValue: createMock<OrmItineraryAdapter>(),
        },
      ],
    }).compile();

    repository = module.get<TypeOrmItineraryRepository>(TypeOrmItineraryRepository);
    itineraryRepository = module.get(getRepositoryToken(ItineraryEntityOrm));
    ticketRepository = module.get(getRepositoryToken(TicketEntityOrm));
    ticketAdapter = module.get(OrmTicketAdapter);
    itineraryAdapter = module.get(OrmItineraryAdapter);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save an itinerary with tickets and return domain entity', async () => {
      // Arrange
      const ticketDomain = {
        kind: 'train',
        from: 'A',
        to: 'B',
      } as TicketEntity;

      const domainItinerary = new ItineraryDomain([ticketDomain], 'test-id');

      const ormItinerary = new ItineraryEntityOrm();
      ormItinerary.id = 'test-id';

      const savedOrmItinerary = new ItineraryEntityOrm();
      savedOrmItinerary.id = 'test-id';

      const ticketOrm = new TicketEntityOrm();
      ticketOrm.kind = 'train';
      ticketOrm.from = 'A';
      ticketOrm.to = 'B';

      const savedTicketOrm = new TicketEntityOrm();
      // Use string for id to match entity type
      savedTicketOrm.id = '1';
      savedTicketOrm.kind = 'train';
      savedTicketOrm.from = 'A';
      savedTicketOrm.to = 'B';
      savedTicketOrm.itineraryId = 'test-id';

      const retrievedOrmItinerary = new ItineraryEntityOrm();
      retrievedOrmItinerary.id = 'test-id';
      retrievedOrmItinerary.tickets = [savedTicketOrm];

      // Mock the adapter and repository methods
      itineraryAdapter.adaptToOrm.mockReturnValue(ormItinerary);
      itineraryRepository.save.mockResolvedValue(savedOrmItinerary);
      ticketAdapter.adaptToOrm.mockReturnValue(ticketOrm);
      ticketRepository.save.mockResolvedValue(savedTicketOrm);
      itineraryRepository.findOne.mockResolvedValue(retrievedOrmItinerary);
      itineraryAdapter.adaptToDomain.mockReturnValue(domainItinerary);

      // Act
      const result = await repository.save(domainItinerary);

      // Assert
      expect(itineraryAdapter.adaptToOrm).toHaveBeenCalledWith(domainItinerary);
      expect(itineraryRepository.save).toHaveBeenCalledWith(ormItinerary);
      expect(ticketAdapter.adaptToOrm).toHaveBeenCalledWith(ticketDomain, 'test-id');
      expect(ticketRepository.save).toHaveBeenCalledWith(ticketOrm);
      expect(itineraryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['tickets'],
      });
      expect(itineraryAdapter.adaptToDomain).toHaveBeenCalledWith(retrievedOrmItinerary);
      expect(result).toBe(domainItinerary);
    });

    it('should throw an error if itinerary cannot be retrieved after save', async () => {
      // Arrange
      const ticketDomain = {
        kind: 'train',
        from: 'A',
        to: 'B',
      } as TicketEntity;

      const domainItinerary = new ItineraryDomain([ticketDomain], 'test-id');

      const ormItinerary = new ItineraryEntityOrm();
      ormItinerary.id = 'test-id';

      const savedOrmItinerary = new ItineraryEntityOrm();
      savedOrmItinerary.id = 'test-id';

      const ticketOrm = new TicketEntityOrm();
      ticketOrm.kind = 'train';

      // Mock the adapter and repository methods
      itineraryAdapter.adaptToOrm.mockReturnValue(ormItinerary);
      itineraryRepository.save.mockResolvedValue(savedOrmItinerary);
      ticketAdapter.adaptToOrm.mockReturnValue(ticketOrm);
      ticketRepository.save.mockResolvedValue(ticketOrm);
      itineraryRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.save(domainItinerary)).rejects.toThrow(
        `Failed to retrieve saved itinerary with ID test-id`,
      );
    });
  });

  describe('findOne', () => {
    it('should return a domain entity when the itinerary exists', async () => {
      // Arrange
      const id = 'test-id';

      const ticketOrm = new TicketEntityOrm();
      // Use string for id to match entity type
      ticketOrm.id = '1';
      ticketOrm.kind = 'train';
      ticketOrm.from = 'A';
      ticketOrm.to = 'B';

      const ormItinerary = new ItineraryEntityOrm();
      ormItinerary.id = id;
      ormItinerary.tickets = [ticketOrm];

      const domainItinerary = new ItineraryDomain([{ kind: 'train', from: 'A', to: 'B' } as TicketEntity], id);

      // Mock repository and adapter methods
      itineraryRepository.findOne.mockResolvedValue(ormItinerary);
      itineraryAdapter.adaptToDomain.mockReturnValue(domainItinerary);

      // Act
      const result = await repository.findOne(id);

      // Assert
      expect(itineraryRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['tickets'],
      });
      expect(itineraryAdapter.adaptToDomain).toHaveBeenCalledWith(ormItinerary);
      expect(result).toBe(domainItinerary);
    });

    it('should return undefined when the itinerary does not exist', async () => {
      // Arrange
      const id = 'non-existent-id';

      // Mock repository method
      itineraryRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findOne(id);

      // Assert
      expect(itineraryRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['tickets'],
      });
      expect(itineraryAdapter.adaptToDomain).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
