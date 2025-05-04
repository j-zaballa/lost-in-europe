import { BadRequestException, Injectable } from '@nestjs/common';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { TicketBaseDto } from '../dto/ticket-base.dto';
import { BusTicketAdapter } from './bus-ticket.adapter';
import { PlaneTicketAdapter } from './plane-ticket.adapter';
import { TrainTicketAdapter } from './train-ticket.adapter';
import { TramTicketAdapter } from './tram-ticket.adapter';

@Injectable()
export class TicketAdapterFactory {
  private readonly entityAdapters = new Map<string, (dto: any) => TicketEntity>();
  private readonly dtoAdapters = new Map<string, (entity: any) => TicketBaseDto>();

  constructor(train: TrainTicketAdapter, plane: PlaneTicketAdapter, bus: BusTicketAdapter, tram: TramTicketAdapter) {
    this.entityAdapters.set('train', (dto) => train.adaptToEntity(dto));
    this.entityAdapters.set('plane', (dto) => plane.adaptToEntity(dto));
    this.entityAdapters.set('bus', (dto) => bus.adaptToEntity(dto));
    this.entityAdapters.set('tram', (dto) => tram.adaptToEntity(dto));

    this.dtoAdapters.set('train', (entity) => train.adaptToDto(entity));
    this.dtoAdapters.set('plane', (entity) => plane.adaptToDto(entity));
    this.dtoAdapters.set('bus', (entity) => bus.adaptToDto(entity));
    this.dtoAdapters.set('tram', (entity) => tram.adaptToDto(entity));
  }

  adaptToEntity(dto: TicketBaseDto): TicketEntity {
    const fn = this.entityAdapters.get(dto.kind);
    if (!fn) {
      throw new BadRequestException(`No adapter registered for kind: ${dto.kind}`);
    }

    return fn(dto);
  }

  adaptToDto(entity: TicketEntity): TicketBaseDto {
    const fn = this.dtoAdapters.get(entity.kind);
    if (!fn) {
      throw new BadRequestException(`No adapter registered for kind: ${entity.kind}`);
    }

    return fn(entity);
  }
}
