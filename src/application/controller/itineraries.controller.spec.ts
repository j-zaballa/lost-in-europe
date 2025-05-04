import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { BusTicketDto } from '../dto/bus-ticket.dto';
import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { ItineraryDto } from '../dto/itinerary.dto';
import { TrainTicketDto } from '../dto/train-ticket.dto';
import { ItinerariesService } from '../service/itineraries.service';
import { ItinerariesController } from './itineraries.controller';

describe('ItinerariesController', () => {
  let controller: ItinerariesController;
  let service: jest.Mocked<ItinerariesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItinerariesController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<ItinerariesController>(ItinerariesController);
    service = module.get(ItinerariesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an itinerary and return the result from service', async () => {
      // Arrange
      const trainTicket = {
        kind: 'train',
        from: 'London',
        to: 'Paris',
        trainNumber: 'TGV-123',
        platform: '3A',
        seat: '15B',
      } as TrainTicketDto;

      const busTicket = {
        kind: 'bus',
        from: 'Paris',
        to: 'Lyon',
        busCode: 'BUS-456',
        seat: '22C',
      } as BusTicketDto;

      const createDto: CreateItineraryDto = {
        tickets: [trainTicket, busTicket],
      };

      const expectedResult: ItineraryDto = {
        id: 'test-id-123',
        tickets: [trainTicket, busTicket],
      };

      service.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createDto);

      // Assert
      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return the itinerary as JSON by default', async () => {
      // Arrange
      const itineraryId = 'test-id-123';
      const trainTicket = {
        kind: 'train',
        from: 'London',
        to: 'Paris',
        trainNumber: 'TGV-123',
        platform: '3A',
        seat: '15B',
      } as TrainTicketDto;

      const expectedItinerary: ItineraryDto = {
        id: itineraryId,
        tickets: [trainTicket],
      };

      const response = {
        json: jest.fn(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as jest.Mocked<Response>;

      service.findOne.mockResolvedValue(expectedItinerary);

      // Act
      await controller.findOne(itineraryId, 'json', response);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(itineraryId);
      expect(response.json).toHaveBeenCalledWith(expectedItinerary);
    });

    it('should use JSON format when no format is specified (default parameter)', async () => {
      // Arrange
      const itineraryId = 'test-id-123';
      const trainTicket = {
        kind: 'train',
        from: 'London',
        to: 'Paris',
        trainNumber: 'TGV-123',
        platform: '3A',
        seat: '15B',
      } as TrainTicketDto;

      const expectedItinerary: ItineraryDto = {
        id: itineraryId,
        tickets: [trainTicket],
      };

      const response = {
        json: jest.fn(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as jest.Mocked<Response>;

      service.findOne.mockResolvedValue(expectedItinerary);

      // Act - note we're not specifying the format parameter here
      await controller.findOne(itineraryId, undefined, response);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(itineraryId);
      expect(response.json).toHaveBeenCalledWith(expectedItinerary);
    });

    it('should return plain text when format is human', async () => {
      // Arrange
      const itineraryId = 'test-id-123';
      const humanReadableText = 'This is a human-readable itinerary';

      const response = {
        json: jest.fn(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as jest.Mocked<Response>;

      service.printItinerary.mockResolvedValue(humanReadableText);

      // Act
      await controller.findOne(itineraryId, 'human', response);

      // Assert
      expect(service.printItinerary).toHaveBeenCalledWith(itineraryId);
      expect(response.type).toHaveBeenCalledWith('text/plain');
      expect(response.send).toHaveBeenCalledWith(humanReadableText);
    });

    it('should pass through exceptions from the service', async () => {
      // Arrange
      const itineraryId = 'non-existent-id';

      const response = {
        json: jest.fn(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as jest.Mocked<Response>;

      const error = new NotFoundException(`Itinerary with ID "${itineraryId}" not found`);
      service.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(itineraryId, 'json', response)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(itineraryId);
      expect(response.json).not.toHaveBeenCalled();
    });

    it('should pass through exceptions from the service for human format', async () => {
      // Arrange
      const itineraryId = 'non-existent-id';

      const response = {
        json: jest.fn(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as jest.Mocked<Response>;

      const error = new NotFoundException(`Itinerary with ID "${itineraryId}" not found`);
      service.printItinerary.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(itineraryId, 'human', response)).rejects.toThrow(NotFoundException);
      expect(service.printItinerary).toHaveBeenCalledWith(itineraryId);
      expect(response.send).not.toHaveBeenCalled();
    });
  });
});
