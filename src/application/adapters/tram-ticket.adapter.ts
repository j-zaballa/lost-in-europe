import { Injectable } from '@nestjs/common';

import { TramTicketEntity } from 'src/domain/entities/tram-ticket.entity';
import { TramTicketDto } from '../dto/tram-ticket.dto';
import { TicketAdapter } from './ticket-adapter.interface';

@Injectable()
export class TramTicketAdapter implements TicketAdapter<TramTicketDto, TramTicketEntity> {
  adaptToEntity(dto: TramTicketDto): TramTicketEntity {
    return new TramTicketEntity(dto.from, dto.to, dto.lineNumber);
  }

  adaptToDto(entity: TramTicketEntity): TramTicketDto {
    const dto = new TramTicketDto();
    dto.from = entity.from;
    dto.to = entity.to;
    dto.lineNumber = entity.lineNumber;
    return dto;
  }
}
