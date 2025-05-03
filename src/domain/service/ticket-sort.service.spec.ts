import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { BusTicketEntity } from '../entities/bus-ticket.entity';
import { LUGGAGE_CHECK_IN_METHODS, PlaneTicketEntity } from '../entities/plane-ticket.entity';
import { TicketEntity } from '../entities/ticket-base.entity';
import { TrainTicketEntity } from '../entities/train-ticket.entity';
import { TramTicketEntity } from '../entities/tram-ticket.entity';
import { TicketSortService } from './ticket-sort.service';

describe('TicketSortService', () => {
  let service: TicketSortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketSortService],
    }).compile();

    service = module.get<TicketSortService>(TicketSortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Helper function to create random tickets of different types
  const createRandomTicket = (from: string, to: string): TicketEntity => {
    const types = ['train', 'plane', 'bus', 'tram'];
    const typeIndex = Math.floor(Math.random() * types.length);
    const type = types[typeIndex];

    switch (type) {
      case 'train':
        return new TrainTicketEntity(
          from,
          to,
          faker.string.alphanumeric(5).toUpperCase(),
          faker.string.numeric(2),
          faker.string.numeric(3),
        );
      case 'plane':
        return new PlaneTicketEntity(
          from,
          to,
          `${faker.airline.aircraftType()} ${faker.string.alphanumeric(4).toUpperCase()}`,
          `${faker.string.alpha(1).toUpperCase()}${faker.number.int({ min: 1, max: 30 })}`,
          faker.string.alphanumeric(3).toUpperCase(),
          Math.random() > 0.5 ? LUGGAGE_CHECK_IN_METHODS.AUTOMATIC : LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN,
        );
      case 'bus':
        return new BusTicketEntity(
          from,
          to,
          faker.string.alphanumeric(5).toUpperCase(),
          Math.random() > 0.3 ? faker.string.numeric(2) : undefined,
        );
      case 'tram':
        return new TramTicketEntity(from, to, faker.string.alphanumeric(3));
      default:
        return new TrainTicketEntity(
          from,
          to,
          faker.string.alphanumeric(5).toUpperCase(),
          faker.string.numeric(2),
          faker.string.numeric(3),
        );
    }
  };

  describe('Semi-Eulerian Path', () => {
    it('should sort tickets correctly for a semi-eulerian path', () => {
      // Create a list of tickets forming a semi-eulerian path (one start, one end)
      // A -> B -> C -> D -> E
      const tickets: TicketEntity[] = [
        createRandomTicket('C', 'D'),
        createRandomTicket('B', 'C'),
        createRandomTicket('D', 'E'),
        createRandomTicket('A', 'B'),
      ];

      const result = service.sort(tickets);

      expect(result).not.toBeNull();
      expect(result?.length).toBe(tickets.length);

      // Verify the correct path order
      for (let i = 0; i < result!.length - 1; i++) {
        expect(result![i].to).toBe(result![i + 1].from);
      }

      // Verify first and last cities
      expect(result![0].from).toBe('A');
      expect(result![result!.length - 1].to).toBe('E');
    });
  });

  describe('Eulerian Circuit', () => {
    it('should sort tickets correctly for a fully eulerian circuit', () => {
      // Create a list of tickets forming a eulerian circuit (all nodes with even degrees)
      // A -> B -> C -> D -> E -> A
      const tickets: TicketEntity[] = [
        createRandomTicket('C', 'D'),
        createRandomTicket('B', 'C'),
        createRandomTicket('D', 'E'),
        createRandomTicket('E', 'A'),
        createRandomTicket('A', 'B'),
      ];

      const result = service.sort(tickets);

      expect(result).not.toBeNull();
      expect(result?.length).toBe(tickets.length);

      // Verify the correct circuit
      for (let i = 0; i < result!.length - 1; i++) {
        expect(result![i].to).toBe(result![i + 1].from);
      }

      // Verify it's a circuit - last ticket's destination is first ticket's origin
      expect(result![result!.length - 1].to).toBe(result![0].from);
    });
  });

  describe('Empty Ticket List', () => {
    it('should return null for an empty ticket list', () => {
      const result = service.sort([]);
      expect(result).toBeNull();
    });
  });

  describe('Invalid Paths', () => {
    it('should return null when in-degree - out-degree > 1 for any node', () => {
      // A -> B, C -> B, D -> B (B has 3 in-edges, 0 out-edges)
      const tickets: TicketEntity[] = [
        createRandomTicket('A', 'B'),
        createRandomTicket('C', 'B'),
        createRandomTicket('D', 'B'),
      ];

      const result = service.sort(tickets);
      expect(result).toBeNull();
    });

    it('should return null when out-degree - in-degree > 1 for any node', () => {
      // A -> B, A -> C, A -> D (A has 3 out-edges, 0 in-edges)
      const tickets: TicketEntity[] = [
        createRandomTicket('A', 'B'),
        createRandomTicket('A', 'C'),
        createRandomTicket('A', 'D'),
      ];

      const result = service.sort(tickets);
      expect(result).toBeNull();
    });

    it('should return null when there are more than one starting node', () => {
      // A -> B -> C, D -> E -> F (two starting nodes: A and D)
      const tickets: TicketEntity[] = [
        createRandomTicket('A', 'B'),
        createRandomTicket('B', 'C'),
        createRandomTicket('D', 'E'),
        createRandomTicket('E', 'F'),
      ];

      const result = service.sort(tickets);
      expect(result).toBeNull();
    });

    it('should return null when there are more than one end node', () => {
      // A -> B -> C, A -> D -> E (two ending nodes: C and E)
      const tickets: TicketEntity[] = [
        createRandomTicket('A', 'B'),
        createRandomTicket('B', 'C'),
        createRandomTicket('A', 'D'),
        createRandomTicket('D', 'E'),
      ];

      const result = service.sort(tickets);
      expect(result).toBeNull();
    });

    it('should return null when there are different numbers of start and end nodes', () => {
      // A -> B, C -> D -> C (one start node A, no end node)
      const tickets: TicketEntity[] = [
        createRandomTicket('A', 'B'),
        createRandomTicket('C', 'D'),
        createRandomTicket('D', 'C'),
      ];

      const result = service.sort(tickets);
      expect(result).toBeNull();
    });

    it('should return null for a disconnected graph', () => {
      // A -> B -> A, C -> D -> C (disconnected graphs)
      const tickets: TicketEntity[] = [
        createRandomTicket('A', 'B'),
        createRandomTicket('B', 'A'),
        createRandomTicket('C', 'D'),
        createRandomTicket('D', 'C'),
      ];

      const result = service.sort(tickets);
      expect(result).toBeNull();
    });
  });
});
