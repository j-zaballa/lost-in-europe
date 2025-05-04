import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BusTicketDto } from 'src/application/dto/bus-ticket.dto';
import { PlaneTicketDto } from 'src/application/dto/plane-ticket.dto';
import { TicketBaseDto } from 'src/application/dto/ticket-base.dto';
import { TrainTicketDto } from 'src/application/dto/train-ticket.dto';
import { TramTicketDto } from 'src/application/dto/tram-ticket.dto';
import { BusTicketEntity } from 'src/domain/entities/bus-ticket.entity';
import { LUGGAGE_CHECK_IN_METHODS, PlaneTicketEntity } from 'src/domain/entities/plane-ticket.entity';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { TrainTicketEntity } from 'src/domain/entities/train-ticket.entity';
import { TramTicketEntity } from 'src/domain/entities/tram-ticket.entity';
import { BusTicketAdapter } from '../bus-ticket.adapter';
import { PlaneTicketAdapter } from '../plane-ticket.adapter';
import { TicketAdapterFactory } from '../ticket-adapter.factory';
import { TrainTicketAdapter } from '../train-ticket.adapter';
import { TramTicketAdapter } from '../tram-ticket.adapter';

describe('TicketAdapterFactory', () => {
  let factory: TicketAdapterFactory;
  let tramAdapter: jest.Mocked<TramTicketAdapter>;
  let trainAdapter: jest.Mocked<TrainTicketAdapter>;
  let planeAdapter: jest.Mocked<PlaneTicketAdapter>;
  let busAdapter: jest.Mocked<BusTicketAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketAdapterFactory],
    })
      .useMocker(createMock)
      .compile();

    factory = module.get<TicketAdapterFactory>(TicketAdapterFactory);
    tramAdapter = module.get(TramTicketAdapter);
    trainAdapter = module.get(TrainTicketAdapter);
    planeAdapter = module.get(PlaneTicketAdapter);
    busAdapter = module.get(BusTicketAdapter);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('adaptToEntity', () => {
    it('should adapt train ticket DTOs to entities', () => {
      // Arrange
      const dto = new TrainTicketDto();
      dto.from = 'Paris';
      dto.to = 'Lyon';
      dto.trainNumber = 'TGV 6201';
      dto.platform = '5';
      dto.seat = '16D';

      const expectedEntity = new TrainTicketEntity('Paris', 'Lyon', 'TGV 6201', '5', '16D');
      trainAdapter.adaptToEntity.mockReturnValue(expectedEntity);

      // Act
      const result = factory.adaptToEntity(dto);

      // Assert
      expect(trainAdapter.adaptToEntity).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedEntity);
    });

    it('should adapt plane ticket DTOs to entities', () => {
      // Arrange
      const dto = new PlaneTicketDto();
      dto.from = 'Berlin';
      dto.to = 'Rome';
      dto.flightNumber = 'LH1870';
      dto.gate = 'B12';
      dto.seat = '22A';
      dto.luggage = LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN;

      const expectedEntity = new PlaneTicketEntity(
        'Berlin',
        'Rome',
        'LH1870',
        '22A',
        'B12',
        LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN,
      );
      planeAdapter.adaptToEntity.mockReturnValue(expectedEntity);

      // Act
      const result = factory.adaptToEntity(dto);

      // Assert
      expect(planeAdapter.adaptToEntity).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedEntity);
    });

    it('should adapt bus ticket DTOs to entities', () => {
      // Arrange
      const dto = new BusTicketDto();
      dto.from = 'Amsterdam';
      dto.to = 'Brussels';
      dto.busCode = 'FLX210';
      dto.seat = '18B';

      const expectedEntity = new BusTicketEntity('Amsterdam', 'Brussels', 'FLX210', '18B');
      busAdapter.adaptToEntity.mockReturnValue(expectedEntity);

      // Act
      const result = factory.adaptToEntity(dto);

      // Assert
      expect(busAdapter.adaptToEntity).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedEntity);
    });

    it('should adapt tram ticket DTOs to entities', () => {
      // Arrange
      const dto = new TramTicketDto();
      dto.from = 'Zurich Center';
      dto.to = 'Zurich Airport';
      dto.lineNumber = 'T12';

      const expectedEntity = new TramTicketEntity('Zurich Center', 'Zurich Airport', 'T12');
      tramAdapter.adaptToEntity.mockReturnValue(expectedEntity);

      // Act
      const result = factory.adaptToEntity(dto);

      // Assert
      expect(tramAdapter.adaptToEntity).toHaveBeenCalledWith(dto);
      expect(result).toBe(expectedEntity);
    });

    it('should throw BadRequestException for unknown ticket kind', () => {
      // Arrange
      const dto = { kind: 'unknown', from: 'A', to: 'B' };

      // Act & Assert
      expect(() => {
        factory.adaptToEntity(dto as TicketBaseDto);
      }).toThrow(BadRequestException);
      expect(() => {
        factory.adaptToEntity(dto as TicketBaseDto);
      }).toThrow('No adapter registered for kind: unknown');
    });
  });

  describe('adaptToDto', () => {
    it('should adapt train ticket entities to DTOs', () => {
      // Arrange
      const entity = new TrainTicketEntity('Milan', 'Venice', 'IC 506', '3', '8C');
      const expectedDto = Object.assign(new TrainTicketDto(), {
        from: 'Milan',
        to: 'Venice',
        trainNumber: 'IC 506',
        platform: '3',
        seat: '8C',
      });
      trainAdapter.adaptToDto.mockReturnValue(expectedDto);

      // Act
      const result = factory.adaptToDto(entity);

      // Assert
      expect(trainAdapter.adaptToDto).toHaveBeenCalledWith(entity);
      expect(result).toBe(expectedDto);
    });

    it('should adapt plane ticket entities to DTOs', () => {
      // Arrange
      const entity = new PlaneTicketEntity(
        'Helsinki',
        'Stockholm',
        'AY123',
        '12C',
        'D7',
        LUGGAGE_CHECK_IN_METHODS.AUTOMATIC,
      );
      const expectedDto = Object.assign(new PlaneTicketDto(), {
        from: 'Helsinki',
        to: 'Stockholm',
        flightNumber: 'AY123',
        seat: '12C',
        gate: 'D7',
        luggage: LUGGAGE_CHECK_IN_METHODS.AUTOMATIC,
      });
      planeAdapter.adaptToDto.mockReturnValue(expectedDto);

      // Act
      const result = factory.adaptToDto(entity);

      // Assert
      expect(planeAdapter.adaptToDto).toHaveBeenCalledWith(entity);
      expect(result).toBe(expectedDto);
    });

    it('should adapt bus ticket entities to DTOs', () => {
      // Arrange
      const entity = new BusTicketEntity('Vienna', 'Bratislava', 'FLX440', '5D');
      const expectedDto = Object.assign(new BusTicketDto(), {
        from: 'Vienna',
        to: 'Bratislava',
        busCode: 'FLX440',
        seat: '5D',
      });
      busAdapter.adaptToDto.mockReturnValue(expectedDto);

      // Act
      const result = factory.adaptToDto(entity);

      // Assert
      expect(busAdapter.adaptToDto).toHaveBeenCalledWith(entity);
      expect(result).toBe(expectedDto);
    });

    it('should adapt tram ticket entities to DTOs', () => {
      // Arrange
      const entity = new TramTicketEntity('Barcelona Center', 'Port Olimpic', 'T4');
      const expectedDto = Object.assign(new TramTicketDto(), {
        from: 'Barcelona Center',
        to: 'Port Olimpic',
        lineNumber: 'T4',
      });
      tramAdapter.adaptToDto.mockReturnValue(expectedDto);

      // Act
      const result = factory.adaptToDto(entity);

      // Assert
      expect(tramAdapter.adaptToDto).toHaveBeenCalledWith(entity);
      expect(result).toBe(expectedDto);
    });

    it('should throw BadRequestException for unknown ticket kind', () => {
      // Arrange
      const entity = { kind: 'unknown', from: 'A', to: 'B' };

      // Act & Assert
      expect(() => {
        factory.adaptToDto(entity as TicketEntity);
      }).toThrow(BadRequestException);
      expect(() => {
        factory.adaptToDto(entity as TicketEntity);
      }).toThrow('No adapter registered for kind: unknown');
    });
  });
});
