import { Injectable } from '@nestjs/common';
import { PlaneTicketEntity } from 'src/domain/entities/plane-ticket.entity';
import { PlaneTicketDto } from '../dto/plane-ticket.dto';
import { TicketAdapter } from './ticket-adapter.interface';

@Injectable()
export class PlaneTicketAdapter
  implements TicketAdapter<PlaneTicketDto, PlaneTicketEntity>
{
  adapt(dto: PlaneTicketDto): PlaneTicketEntity {
    return new PlaneTicketEntity(
      dto.from,
      dto.to,
      dto.flightNumber,
      dto.seat,
      dto.gate,
    );
  }
}
