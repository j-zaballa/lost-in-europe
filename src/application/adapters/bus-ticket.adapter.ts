import { Injectable } from '@nestjs/common';
import { BusTicketEntity } from 'src/domain/entities/bus-ticket.entity';
import { BusTicketDto } from '../dto/bus-ticket.dto';
import { TicketAdapter } from './ticket-adapter.interface';

@Injectable()
export class BusTicketAdapter
  implements TicketAdapter<BusTicketDto, BusTicketEntity>
{
  adapt(dto: BusTicketDto): BusTicketEntity {
    return new BusTicketEntity(dto.from, dto.to, dto.busCode);
  }
}
