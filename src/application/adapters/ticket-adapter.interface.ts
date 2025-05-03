import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { TicketBaseDto } from '../dto/ticket-base.dto';

export interface TicketAdapter<Dto extends TicketBaseDto, Entity extends TicketEntity> {
  adaptToEntity(dto: Dto): Entity;
  adaptToDto(entity: Entity): Dto;
}
