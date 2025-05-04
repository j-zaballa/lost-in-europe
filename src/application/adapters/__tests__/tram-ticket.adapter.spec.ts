import { Test, TestingModule } from '@nestjs/testing';
import { TramTicketDto } from 'src/application/dto/tram-ticket.dto';
import { TramTicketEntity } from 'src/domain/entities/tram-ticket.entity';
import { TramTicketAdapter } from '../tram-ticket.adapter';

describe('TramTicketAdapter', () => {
  let adapter: TramTicketAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TramTicketAdapter],
    }).compile();

    adapter = module.get<TramTicketAdapter>(TramTicketAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('adaptToEntity', () => {
    it('should convert DTO to entity', () => {
      // Arrange
      const dto = new TramTicketDto();
      dto.from = 'Paris';
      dto.to = 'Lyon';
      dto.lineNumber = 'T4';

      // Act
      const entity = adapter.adaptToEntity(dto);

      // Assert
      expect(entity).toBeInstanceOf(TramTicketEntity);
      expect(entity.from).toBe('Paris');
      expect(entity.to).toBe('Lyon');
      expect(entity.lineNumber).toBe('T4');
      expect(entity.kind).toBe('tram');
    });
  });

  describe('adaptToDto', () => {
    it('should convert entity to DTO', () => {
      // Arrange
      const entity = new TramTicketEntity('Berlin', 'Munich', 'S5');

      // Act
      const dto = adapter.adaptToDto(entity);

      // Assert
      expect(dto).toBeInstanceOf(TramTicketDto);
      expect(dto.from).toBe('Berlin');
      expect(dto.to).toBe('Munich');
      expect(dto.lineNumber).toBe('S5');
      expect(dto.kind).toBe('tram');
    });
  });
});
