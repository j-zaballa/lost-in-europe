import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItineraryEntity as ItineraryDomain } from 'src/domain/entities/itinerary.entity';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { OrmItineraryAdapter } from 'src/infraestructure/adapters/orm-itinerary.adapter';
import { OrmTicketAdapter } from 'src/infraestructure/adapters/orm-ticket.adapter';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { ItineraryEntity as ItineraryEntityOrm } from '../../database/entities/itinerary.entity';
import { TicketEntity as TicketEntityOrm } from '../../database/entities/ticket.entity';
import { TypeOrmItineraryRepository } from '../type-orm-itinerary-repository';

describe('TypeOrmItineraryRepository', () => {
  let repository: TypeOrmItineraryRepository;
  let itineraryRepository: jest.Mocked<Repository<ItineraryEntityOrm>>;
  let ticketAdapter: jest.Mocked<OrmTicketAdapter>;
  let itineraryAdapter: jest.Mocked<OrmItineraryAdapter>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunnerMock: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    // Create a mock query runner with all needed methods
    queryRunnerMock = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: {
        save: jest.fn(),
      } as unknown as EntityManager,
    } as unknown as jest.Mocked<QueryRunner>;

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
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeOrmItineraryRepository>(TypeOrmItineraryRepository);
    itineraryRepository = module.get(getRepositoryToken(ItineraryEntityOrm));
    ticketAdapter = module.get(OrmTicketAdapter);
    itineraryAdapter = module.get(OrmItineraryAdapter);
    dataSource = module.get(DataSource);
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
      (queryRunnerMock.manager.save as jest.Mock).mockImplementation((entity) => {
        if (entity === ItineraryEntityOrm) {
          return Promise.resolve(savedOrmItinerary);
        } else if (entity === TicketEntityOrm) {
          return Promise.resolve(savedTicketOrm);
        }
        return Promise.resolve(null);
      });
      ticketAdapter.adaptToOrm.mockReturnValue(ticketOrm);
      itineraryRepository.findOne.mockResolvedValue(retrievedOrmItinerary);
      itineraryAdapter.adaptToDomain.mockReturnValue(domainItinerary);

      // Act
      const result = await repository.save(domainItinerary);

      // Assert
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunnerMock.connect).toHaveBeenCalled();
      expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
      expect(itineraryAdapter.adaptToOrm).toHaveBeenCalledWith(domainItinerary);
      expect(queryRunnerMock.manager.save).toHaveBeenCalledWith(ItineraryEntityOrm, ormItinerary);
      expect(ticketAdapter.adaptToOrm).toHaveBeenCalledWith(ticketDomain, 'test-id');
      expect(queryRunnerMock.manager.save).toHaveBeenCalledWith(TicketEntityOrm, ticketOrm);
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
      expect(itineraryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['tickets'],
      });
      expect(itineraryAdapter.adaptToDomain).toHaveBeenCalledWith(retrievedOrmItinerary);
      expect(queryRunnerMock.release).toHaveBeenCalled();
      expect(result).toBe(domainItinerary);
    });

    it('should throw a NotFoundException if itinerary cannot be retrieved after save', async () => {
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
      (queryRunnerMock.manager.save as jest.Mock).mockImplementation((entity) => {
        if (entity === ItineraryEntityOrm) {
          return Promise.resolve(savedOrmItinerary);
        } else if (entity === TicketEntityOrm) {
          return Promise.resolve(ticketOrm);
        }
        return Promise.resolve(null);
      });
      ticketAdapter.adaptToOrm.mockReturnValue(ticketOrm);
      itineraryRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.save(domainItinerary)).rejects.toThrow(NotFoundException);
      expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunnerMock.release).toHaveBeenCalled();
    });

    it('should rollback transaction and rethrow error if any operation fails', async () => {
      // Arrange
      const error = new Error('Database error');
      const domainItinerary = new ItineraryDomain([{ kind: 'train' } as TicketEntity], 'test-id');
      const ormItinerary = new ItineraryEntityOrm();

      // Mock methods to throw an error
      itineraryAdapter.adaptToOrm.mockReturnValue(ormItinerary);
      (queryRunnerMock.manager.save as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(repository.save(domainItinerary)).rejects.toThrow(error);
      expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunnerMock.release).toHaveBeenCalled();
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
