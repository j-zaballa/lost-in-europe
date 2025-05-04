import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { TicketSortService } from 'src/domain/service/ticket-sort.service';
import { ItineraryRepository } from 'src/infraestructure/repository/itinerary-repository';
import { TicketAdapterFactory } from '../adapters/ticket-adapter.factory';
import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { TicketBaseDto } from '../dto/ticket-base.dto';
import { ItinerariesService } from './itineraries.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('ItinerariesService', () => {
  let service: ItinerariesService;
  let sortService: jest.Mocked<TicketSortService>;
  let ticketAdapter: jest.Mocked<TicketAdapterFactory>;
  let repo: jest.Mocked<ItineraryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItinerariesService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ItinerariesService>(ItinerariesService);
    sortService = module.get(TicketSortService);
    ticketAdapter = module.get(TicketAdapterFactory);
    repo = module.get(ItineraryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an itinerary successfully', async () => {
      // Arrange
      const mockTicketDtos: TicketBaseDto[] = [{ kind: 'train', from: 'A', to: 'B' }];
      const mockTicketEntity = {
        kind: 'train',
        from: 'A',
        to: 'B',
        toHumanString: jest.fn(),
      } as TicketEntity;
      const mockTicketEntities = [mockTicketEntity];
      const mockCreateDto = { tickets: mockTicketDtos } as CreateItineraryDto;

      ticketAdapter.adaptToEntity.mockReturnValueOnce(mockTicketEntity);
      sortService.sort.mockReturnValueOnce(mockTicketEntities);
      repo.save.mockResolvedValueOnce(new ItineraryEntity(mockTicketEntities, 'mocked-uuid'));
      ticketAdapter.adaptToDto.mockReturnValueOnce(mockTicketDtos[0]);

      // Act
      const result = await service.create(mockCreateDto);

      // Assert
      expect(result).toEqual({
        id: 'mocked-uuid',
        tickets: mockTicketDtos,
      });
      expect(ticketAdapter.adaptToEntity).toHaveBeenCalledWith(mockTicketDtos[0]);
      expect(sortService.sort).toHaveBeenCalledWith(mockTicketEntities);
      expect(repo.save).toHaveBeenCalledWith(expect.any(ItineraryEntity));
      expect(ticketAdapter.adaptToDto).toHaveBeenCalledWith(mockTicketEntities[0]);
    });

    it('should throw BadRequestException when no itinerary can be found', async () => {
      // Arrange
      const mockTicketDtos: TicketBaseDto[] = [{ kind: 'train', from: 'A', to: 'B' }];
      const mockTicketEntity = {
        kind: 'train',
        from: 'A',
        to: 'B',
        toHumanString: jest.fn(),
      } as TicketEntity;
      const mockCreateDto = { tickets: mockTicketDtos } as CreateItineraryDto;

      ticketAdapter.adaptToEntity.mockReturnValueOnce(mockTicketEntity);
      sortService.sort.mockReturnValueOnce(null);

      // Act & Assert
      await expect(service.create(mockCreateDto)).rejects.toThrow(BadRequestException);
      expect(sortService.sort).toHaveBeenCalledWith([mockTicketEntity]);
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an itinerary when it exists', async () => {
      // Arrange
      const id = 'existing-id';
      const mockTicketEntity = {
        kind: 'train',
        from: 'A',
        to: 'B',
        toHumanString: jest.fn(),
      } as TicketEntity;
      const mockTicketEntities = [mockTicketEntity];
      const mockTicketDtos: TicketBaseDto[] = [{ kind: 'train', from: 'A', to: 'B' }];
      const mockItinerary = new ItineraryEntity(mockTicketEntities, id);

      repo.findOne.mockResolvedValueOnce(mockItinerary);
      ticketAdapter.adaptToDto.mockReturnValueOnce(mockTicketDtos[0]);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(result).toEqual({
        id,
        tickets: mockTicketDtos,
      });
      expect(repo.findOne).toHaveBeenCalledWith(id);
      expect(ticketAdapter.adaptToDto).toHaveBeenCalledWith(mockTicketEntities[0]);
    });

    it('should throw NotFoundException when itinerary does not exist', async () => {
      // Arrange
      const id = 'non-existing-id';
      repo.findOne.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('printItinerary', () => {
    it('should return a human-readable string for an existing itinerary', async () => {
      // Arrange
      const id = 'existing-id';
      const mockTicketEntity = {
        kind: 'train',
        from: 'A',
        to: 'B',
        toHumanString: jest.fn(),
      } as TicketEntity;
      const mockItinerary = new ItineraryEntity([mockTicketEntity], id);
      const humanReadableString = 'Human readable itinerary';

      repo.findOne.mockResolvedValue(mockItinerary);
      jest.spyOn(mockItinerary, 'toHumanString').mockReturnValueOnce(humanReadableString);

      // Act
      const result = await service.printItinerary(id);

      // Assert
      expect(result).toBe(humanReadableString);
      expect(repo.findOne).toHaveBeenCalledWith(id);
      expect(mockItinerary.toHumanString).toHaveBeenCalled();
    });

    it('should throw NotFoundException when itinerary does not exist', async () => {
      // Arrange
      const id = 'non-existing-id';
      repo.findOne.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.printItinerary(id)).rejects.toThrow(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith(id);
    });
  });
});
