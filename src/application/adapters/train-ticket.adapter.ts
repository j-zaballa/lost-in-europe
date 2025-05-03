import { Injectable } from '@nestjs/common';
import { TrainTicketEntity } from 'src/domain/entities/train-ticket.entity';
import { TrainTicketDto } from '../dto/train-ticket.dto';
import { TicketAdapter } from './ticket-adapter.interface';

@Injectable()
export class TrainTicketAdapter implements TicketAdapter<TrainTicketDto, TrainTicketEntity> {
  adaptToEntity(dto: TrainTicketDto): TrainTicketEntity {
    return new TrainTicketEntity(dto.from, dto.to, dto.trainNumber, dto.platform, dto.seat);
  }

  adaptToDto(entity: TrainTicketEntity): TrainTicketDto {
    const dto = new TrainTicketDto();
    dto.from = entity.from;
    dto.to = entity.to;
    dto.trainNumber = entity.trainNumber;
    dto.platform = entity.platform;
    dto.seat = entity.seat;
    return dto;
  }
}
