import { Test, TestingModule } from '@nestjs/testing';
import { PlaneTicketDto } from 'src/application/dto/plane-ticket.dto';
import { LUGGAGE_CHECK_IN_METHODS, PlaneTicketEntity } from 'src/domain/entities/plane-ticket.entity';
import { PlaneTicketAdapter } from '../plane-ticket.adapter';

describe('PlaneTicketAdapter', () => {
  let adapter: PlaneTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaneTicketAdapter],
    }).compile();

    adapter = module.get<PlaneTicketAdapter>(PlaneTicketAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('adaptToEntity', () => {
    it('should convert DTO to entity with self-check-in luggage', () => {
      // Arrange
      const dto = new PlaneTicketDto();
      dto.from = 'London';
      dto.to = 'New York';
      dto.flightNumber = 'BA172';
      dto.gate = 'G12';
      dto.seat = '24A';
      dto.luggage = LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN;

      // Act
      const entity = adapter.adaptToEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(PlaneTicketEntity);
      expect(entity.from).toBe('London');
      expect(entity.to).toBe('New York');
      expect(entity.flightNumber).toBe('BA172');
      expect(entity.gate).toBe('G12');
      expect(entity.seat).toBe('24A');
      expect(entity.luggage).toBe(LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN);
      expect(entity.kind).toBe('plane');
    });

    it('should convert DTO to entity with automatic luggage', () => {
      // Arrange
      const dto = new PlaneTicketDto();
      dto.from = 'London';
      dto.to = 'New York';
      dto.flightNumber = 'BA172';
      dto.gate = 'G12';
      dto.seat = '24A';
      dto.luggage = LUGGAGE_CHECK_IN_METHODS.AUTOMATIC;

      // Act
      const entity = adapter.adaptToEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(PlaneTicketEntity);
      expect(entity.from).toBe('London');
      expect(entity.to).toBe('New York');
      expect(entity.flightNumber).toBe('BA172');
      expect(entity.gate).toBe('G12');
      expect(entity.seat).toBe('24A');
      expect(entity.luggage).toBe(LUGGAGE_CHECK_IN_METHODS.AUTOMATIC);
      expect(entity.kind).toBe('plane');
    });
  });

  describe('adaptToDto', () => {
    it('should convert entity to DTO with self-check-in luggage', () => {
      // Arrange
      const entity = new PlaneTicketEntity(
        'Madrid',
        'Barcelona',
        'IB6104',
        '15B',
        'D5',
        LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN,
      );

      // Act
      const dto = adapter.adaptToDto(entity);

      // Assert
      expect(dto).toBeInstanceOf(PlaneTicketDto);
      expect(dto.from).toBe('Madrid');
      expect(dto.to).toBe('Barcelona');
      expect(dto.flightNumber).toBe('IB6104');
      expect(dto.gate).toBe('D5');
      expect(dto.seat).toBe('15B');
      expect(dto.luggage).toBe(LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN);
      expect(dto.kind).toBe('plane');
    });

    it('should convert entity to DTO with automatic luggage', () => {
      // Arrange
      const entity = new PlaneTicketEntity(
        'Madrid',
        'Barcelona',
        'IB6104',
        '15B',
        'D5',
        LUGGAGE_CHECK_IN_METHODS.AUTOMATIC,
      );

      // Act
      const dto = adapter.adaptToDto(entity);

      // Assert
      expect(dto).toBeInstanceOf(PlaneTicketDto);
      expect(dto.from).toBe('Madrid');
      expect(dto.to).toBe('Barcelona');
      expect(dto.flightNumber).toBe('IB6104');
      expect(dto.gate).toBe('D5');
      expect(dto.seat).toBe('15B');
      expect(dto.luggage).toBe(LUGGAGE_CHECK_IN_METHODS.AUTOMATIC);
      expect(dto.kind).toBe('plane');
    });
  });
});
