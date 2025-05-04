import { Test, TestingModule } from '@nestjs/testing';
import { BusTicketEntity } from 'src/domain/entities/bus-ticket.entity';
import { LUGGAGE_CHECK_IN_METHODS, PlaneTicketEntity } from 'src/domain/entities/plane-ticket.entity';
import { TrainTicketEntity } from 'src/domain/entities/train-ticket.entity';
import { TramTicketEntity } from 'src/domain/entities/tram-ticket.entity';
import { TicketEntity as TicketOrm } from '../../database/entities/ticket.entity';
import { OrmTicketAdapter } from '../orm-ticket.adapter';

describe('OrmTicketAdapter', () => {
  let adapter: OrmTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrmTicketAdapter],
    }).compile();

    adapter = module.get<OrmTicketAdapter>(OrmTicketAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('adaptToDomain', () => {
    it('should convert a train ticket ORM entity to a domain entity', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'train';
      ormTicket.from = 'London';
      ormTicket.to = 'Paris';
      ormTicket.trainNumber = 'TGV-123';
      ormTicket.platform = '5A';
      ormTicket.seat = '15B';

      // Act
      const result = adapter.adaptToDomain(ormTicket);

      // Assert
      expect(result).toBeInstanceOf(TrainTicketEntity);
      expect(result.kind).toBe('train');
      expect(result.from).toBe('London');
      expect(result.to).toBe('Paris');
      expect((result as TrainTicketEntity).trainNumber).toBe('TGV-123');
      expect((result as TrainTicketEntity).platform).toBe('5A');
      expect((result as TrainTicketEntity).seat).toBe('15B');
    });

    it('should convert a train ticket ORM entity with null fields to a domain entity with empty strings', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'train';
      ormTicket.from = 'London';
      ormTicket.to = 'Paris';
      ormTicket.trainNumber = null;
      ormTicket.platform = null;
      ormTicket.seat = null;

      // Act
      const result = adapter.adaptToDomain(ormTicket);

      // Assert
      expect(result).toBeInstanceOf(TrainTicketEntity);
      expect((result as TrainTicketEntity).trainNumber).toBe('');
      expect((result as TrainTicketEntity).platform).toBe('');
      expect((result as TrainTicketEntity).seat).toBe('');
    });

    it('should convert a plane ticket ORM entity to a domain entity', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'plane';
      ormTicket.from = 'London';
      ormTicket.to = 'New York';
      ormTicket.flightNumber = 'BA-123';
      ormTicket.gate = 'G12';
      ormTicket.seat = '34A';
      ormTicket.luggage = LUGGAGE_CHECK_IN_METHODS.AUTOMATIC;

      // Act
      const result = adapter.adaptToDomain(ormTicket);

      // Assert
      expect(result).toBeInstanceOf(PlaneTicketEntity);
      expect(result.kind).toBe('plane');
      expect(result.from).toBe('London');
      expect(result.to).toBe('New York');
      expect((result as PlaneTicketEntity).flightNumber).toBe('BA-123');
      expect((result as PlaneTicketEntity).gate).toBe('G12');
      expect((result as PlaneTicketEntity).seat).toBe('34A');
      expect((result as PlaneTicketEntity).luggage).toBe(LUGGAGE_CHECK_IN_METHODS.AUTOMATIC);
    });

    it('should convert a plane ticket with null fields to a domain entity with defaults', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'plane';
      ormTicket.from = 'London';
      ormTicket.to = 'New York';
      ormTicket.flightNumber = null;
      ormTicket.gate = null;
      ormTicket.seat = null;
      ormTicket.luggage = null;

      // Act
      const result = adapter.adaptToDomain(ormTicket);

      // Assert
      expect(result).toBeInstanceOf(PlaneTicketEntity);
      expect((result as PlaneTicketEntity).flightNumber).toBe('');
      expect((result as PlaneTicketEntity).gate).toBe('');
      expect((result as PlaneTicketEntity).seat).toBe('');
      expect((result as PlaneTicketEntity).luggage).toBe(LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN);
    });

    it('should convert a bus ticket ORM entity to a domain entity', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'bus';
      ormTicket.from = 'London';
      ormTicket.to = 'Manchester';
      ormTicket.busCode = 'BUS-456';
      ormTicket.seat = '22C';

      // Act
      const result = adapter.adaptToDomain(ormTicket);

      // Assert
      expect(result).toBeInstanceOf(BusTicketEntity);
      expect(result.kind).toBe('bus');
      expect(result.from).toBe('London');
      expect(result.to).toBe('Manchester');
      expect((result as BusTicketEntity).busCode).toBe('BUS-456');
      expect((result as BusTicketEntity).seat).toBe('22C');
    });

    it('should convert a tram ticket ORM entity to a domain entity', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'tram';
      ormTicket.from = 'Station A';
      ormTicket.to = 'Station B';
      ormTicket.lineNumber = 'T1';

      // Act
      const result = adapter.adaptToDomain(ormTicket);

      // Assert
      expect(result).toBeInstanceOf(TramTicketEntity);
      expect(result.kind).toBe('tram');
      expect(result.from).toBe('Station A');
      expect(result.to).toBe('Station B');
      expect((result as TramTicketEntity).lineNumber).toBe('T1');
    });

    it('should throw an error for an unknown ticket kind', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'unknown';
      ormTicket.from = 'A';
      ormTicket.to = 'B';

      // Act & Assert
      expect(() => adapter.adaptToDomain(ormTicket)).toThrow('Unknown ticket kind: unknown');
    });
  });

  describe('adaptToOrm', () => {
    it('should convert a train ticket domain entity to an ORM entity', () => {
      // Arrange
      const domainTicket = new TrainTicketEntity('London', 'Paris', 'TGV-123', '5A', '15B');

      // Act
      const result = adapter.adaptToOrm(domainTicket, 'itinerary-1');

      // Assert
      expect(result).toBeInstanceOf(TicketOrm);
      expect(result.kind).toBe('train');
      expect(result.from).toBe('London');
      expect(result.to).toBe('Paris');
      expect(result.trainNumber).toBe('TGV-123');
      expect(result.platform).toBe('5A');
      expect(result.seat).toBe('15B');
      expect(result.itineraryId).toBe('itinerary-1');
      // Other fields should be null
      expect(result.flightNumber).toBeNull();
      expect(result.gate).toBeNull();
      expect(result.luggage).toBeNull();
      expect(result.busCode).toBeNull();
      expect(result.lineNumber).toBeNull();
    });

    it('should convert a train ticket domain entity without itineraryId', () => {
      // Arrange
      const domainTicket = new TrainTicketEntity('London', 'Paris', 'TGV-123', '5A', '15B');

      // Act
      const result = adapter.adaptToOrm(domainTicket);

      // Assert
      expect(result.itineraryId).toBeNull();
    });

    it('should convert a plane ticket domain entity to an ORM entity', () => {
      // Arrange
      const domainTicket = new PlaneTicketEntity(
        'London',
        'New York',
        'BA-123',
        '34A',
        'G12',
        LUGGAGE_CHECK_IN_METHODS.AUTOMATIC,
      );

      // Act
      const result = adapter.adaptToOrm(domainTicket, 'itinerary-1');

      // Assert
      expect(result).toBeInstanceOf(TicketOrm);
      expect(result.kind).toBe('plane');
      expect(result.from).toBe('London');
      expect(result.to).toBe('New York');
      expect(result.flightNumber).toBe('BA-123');
      expect(result.seat).toBe('34A');
      expect(result.gate).toBe('G12');
      expect(result.luggage).toBe(LUGGAGE_CHECK_IN_METHODS.AUTOMATIC);
      expect(result.itineraryId).toBe('itinerary-1');
      // Other fields should be null
      expect(result.trainNumber).toBeNull();
      expect(result.platform).toBeNull();
      expect(result.busCode).toBeNull();
      expect(result.lineNumber).toBeNull();
    });

    it('should convert a bus ticket domain entity to an ORM entity', () => {
      // Arrange
      const domainTicket = new BusTicketEntity('London', 'Manchester', 'BUS-456', '22C');

      // Act
      const result = adapter.adaptToOrm(domainTicket, 'itinerary-1');

      // Assert
      expect(result).toBeInstanceOf(TicketOrm);
      expect(result.kind).toBe('bus');
      expect(result.from).toBe('London');
      expect(result.to).toBe('Manchester');
      expect(result.busCode).toBe('BUS-456');
      expect(result.seat).toBe('22C');
      expect(result.itineraryId).toBe('itinerary-1');
      // Other fields should be null
      expect(result.trainNumber).toBeNull();
      expect(result.platform).toBeNull();
      expect(result.flightNumber).toBeNull();
      expect(result.gate).toBeNull();
      expect(result.luggage).toBeNull();
      expect(result.lineNumber).toBeNull();
    });

    it('should convert a tram ticket domain entity to an ORM entity', () => {
      // Arrange
      const domainTicket = new TramTicketEntity('Station A', 'Station B', 'T1');

      // Act
      const result = adapter.adaptToOrm(domainTicket, 'itinerary-1');

      // Assert
      expect(result).toBeInstanceOf(TicketOrm);
      expect(result.kind).toBe('tram');
      expect(result.from).toBe('Station A');
      expect(result.to).toBe('Station B');
      expect(result.lineNumber).toBe('T1');
      expect(result.itineraryId).toBe('itinerary-1');
      // Other fields should be null
      expect(result.trainNumber).toBeNull();
      expect(result.platform).toBeNull();
      expect(result.flightNumber).toBeNull();
      expect(result.gate).toBeNull();
      expect(result.luggage).toBeNull();
      expect(result.busCode).toBeNull();
    });
  });

  describe('mapLuggageMethod', () => {
    it('should map AUTOMATIC luggage method correctly', () => {
      // Arrange & Act
      // Using adaptToDomain to test the private method
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'plane';
      ormTicket.from = 'A';
      ormTicket.to = 'B';
      ormTicket.luggage = LUGGAGE_CHECK_IN_METHODS.AUTOMATIC;

      // Act
      const result = adapter.adaptToDomain(ormTicket) as PlaneTicketEntity;

      // Assert
      expect(result.luggage).toBe(LUGGAGE_CHECK_IN_METHODS.AUTOMATIC);
    });

    it('should default to SELF_CHECK_IN for any other value', () => {
      // Arrange
      const ormTicket = new TicketOrm();
      ormTicket.kind = 'plane';
      ormTicket.from = 'A';
      ormTicket.to = 'B';
      ormTicket.luggage = 'invalid-value';

      // Act
      const result = adapter.adaptToDomain(ormTicket) as PlaneTicketEntity;

      // Assert
      expect(result.luggage).toBe(LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN);
    });
  });
});
