import { Injectable } from '@nestjs/common';
import { BusTicketEntity } from 'src/domain/entities/bus-ticket.entity';
import { BusTicketDto } from '../dto/bus-ticket.dto';
import { TicketAdapter } from './ticket-adapter.interface';

@Injectable()
export class BusTicketAdapter implements TicketAdapter<BusTicketDto, BusTicketEntity> {
  adaptToEntity(dto: BusTicketDto): BusTicketEntity {
    return new BusTicketEntity(dto.from, dto.to, dto.busCode, dto.seat);
  }

  adaptToDto(entity: BusTicketEntity): BusTicketDto {
    const dto = new BusTicketDto();
    dto.from = entity.from;
    dto.to = entity.to;
    dto.busCode = entity.busCode;
    dto.seat = entity.seat;
    return dto;
  }
}
