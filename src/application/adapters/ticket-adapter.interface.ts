import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { TicketBaseDto } from '../dto/ticket-base.dto';

export interface TicketAdapter<
  Dto extends TicketBaseDto,
  Entity extends TicketEntity,
> {
  adapt(dto: Dto): Entity;
}
