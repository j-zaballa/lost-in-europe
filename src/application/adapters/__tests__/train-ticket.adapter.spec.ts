import { Test, TestingModule } from '@nestjs/testing';
import { TrainTicketDto } from 'src/application/dto/train-ticket.dto';
import { TrainTicketEntity } from 'src/domain/entities/train-ticket.entity';
import { TrainTicketAdapter } from '../train-ticket.adapter';

describe('TrainTicketAdapter', () => {
  let adapter: TrainTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainTicketAdapter],
    }).compile();

    adapter = module.get<TrainTicketAdapter>(TrainTicketAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('adaptToEntity', () => {
    it('should convert DTO to entity', () => {
      // Arrange
      const dto = new TrainTicketDto();
      dto.from = 'Madrid';
      dto.to = 'Barcelona';
      dto.trainNumber = 'AVE 5432';
      dto.platform = '7';
      dto.seat = '12C';

      // Act
      const entity = adapter.adaptToEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(TrainTicketEntity);
      expect(entity.from).toBe('Madrid');
      expect(entity.to).toBe('Barcelona');
      expect(entity.trainNumber).toBe('AVE 5432');
      expect(entity.platform).toBe('7');
      expect(entity.seat).toBe('12C');
      expect(entity.kind).toBe('train');
    });
  });

  describe('adaptToDto', () => {
    it('should convert entity to DTO', () => {
      // Arrange
      const entity = new TrainTicketEntity('London', 'Paris', 'Eurostar 9031', '5', '15D');

      // Act
      const dto = adapter.adaptToDto(entity);

      // Assert
      expect(dto).toBeInstanceOf(TrainTicketDto);
      expect(dto.from).toBe('London');
      expect(dto.to).toBe('Paris');
      expect(dto.trainNumber).toBe('Eurostar 9031');
      expect(dto.platform).toBe('5');
      expect(dto.seat).toBe('15D');
      expect(dto.kind).toBe('train');
    });
  });
});
