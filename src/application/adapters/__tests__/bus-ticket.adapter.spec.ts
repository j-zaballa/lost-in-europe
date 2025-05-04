import { Test, TestingModule } from '@nestjs/testing';
import { BusTicketDto } from 'src/application/dto/bus-ticket.dto';
import { BusTicketEntity } from 'src/domain/entities/bus-ticket.entity';
import { BusTicketAdapter } from '../bus-ticket.adapter';

describe('BusTicketAdapter', () => {
  let adapter: BusTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusTicketAdapter],
    }).compile();

    adapter = module.get<BusTicketAdapter>(BusTicketAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('adaptToEntity', () => {
    it('should convert DTO to entity with seat', () => {
      // Arrange
      const dto = new BusTicketDto();
      dto.from = 'Rome';
      dto.to = 'Florence';
      dto.busCode = 'FLX321';
      dto.seat = '24B';

      // Act
      const entity = adapter.adaptToEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(BusTicketEntity);
      expect(entity.from).toBe('Rome');
      expect(entity.to).toBe('Florence');
      expect(entity.busCode).toBe('FLX321');
      expect(entity.seat).toBe('24B');
      expect(entity.kind).toBe('bus');
    });

    it('should convert DTO to entity without seat', () => {
      // Arrange
      const dto = new BusTicketDto();
      dto.from = 'Rome';
      dto.to = 'Florence';
      dto.busCode = 'FLX321';
      // No seat

      // Act
      const entity = adapter.adaptToEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(BusTicketEntity);
      expect(entity.from).toBe('Rome');
      expect(entity.to).toBe('Florence');
      expect(entity.busCode).toBe('FLX321');
      expect(entity.seat).toBeUndefined();
      expect(entity.kind).toBe('bus');
    });
  });

  describe('adaptToDto', () => {
    it('should convert entity to DTO with seat', () => {
      // Arrange
      const entity = new BusTicketEntity('Berlin', 'Hamburg', 'Flixbus 103', '18A');

      // Act
      const dto = adapter.adaptToDto(entity);

      // Assert
      expect(dto).toBeInstanceOf(BusTicketDto);
      expect(dto.from).toBe('Berlin');
      expect(dto.to).toBe('Hamburg');
      expect(dto.busCode).toBe('Flixbus 103');
      expect(dto.seat).toBe('18A');
      expect(dto.kind).toBe('bus');
    });

    it('should convert entity to DTO without seat', () => {
      // Arrange
      const entity = new BusTicketEntity(
        'Berlin',
        'Hamburg',
        'Flixbus 103',
        // No seat
      );

      // Act
      const dto = adapter.adaptToDto(entity);

      // Assert
      expect(dto).toBeInstanceOf(BusTicketDto);
      expect(dto.from).toBe('Berlin');
      expect(dto.to).toBe('Hamburg');
      expect(dto.busCode).toBe('Flixbus 103');
      expect(dto.seat).toBeUndefined();
      expect(dto.kind).toBe('bus');
    });
  });
});
