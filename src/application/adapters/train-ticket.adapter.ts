import { Injectable } from '@nestjs/common';
import { TrainTicketEntity } from 'src/domain/entities/train-ticket.entity';
import { TrainTicketDto } from '../dto/train-ticket.dto';
import { TicketAdapter } from './ticket-adapter.interface';

@Injectable()
export class TrainTicketAdapter
  implements TicketAdapter<TrainTicketDto, TrainTicketEntity>
{
  adapt(dto: TrainTicketDto): TrainTicketEntity {
    return new TrainTicketEntity(dto.from, dto.to, dto.trainNumber, dto.seat);
  }
}
