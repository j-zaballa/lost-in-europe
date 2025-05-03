import { Injectable } from '@nestjs/common';
import { PlaneTicketEntity } from 'src/domain/entities/plane-ticket.entity';
import { PlaneTicketDto } from '../dto/plane-ticket.dto';
import { TicketAdapter } from './ticket-adapter.interface';

@Injectable()
export class PlaneTicketAdapter implements TicketAdapter<PlaneTicketDto, PlaneTicketEntity> {
  adaptToEntity(dto: PlaneTicketDto): PlaneTicketEntity {
    return new PlaneTicketEntity(dto.from, dto.to, dto.flightNumber, dto.seat, dto.gate, dto.luggage);
  }

  adaptToDto(entity: PlaneTicketEntity): PlaneTicketDto {
    const dto = new PlaneTicketDto();
    dto.from = entity.from;
    dto.to = entity.to;
    dto.flightNumber = entity.flightNumber;
    dto.seat = entity.seat;
    dto.gate = entity.gate;
    dto.luggage = entity.luggage;
    return dto;
  }
}
