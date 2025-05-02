import { BadRequestException, Injectable } from '@nestjs/common';
import { TicketEntity } from 'src/domain/entities/ticket-base.entity';
import { TicketBaseDto } from '../dto/ticket-base.dto';
import { BusTicketAdapter } from './bus-ticket.adapter';
import { PlaneTicketAdapter } from './plane-ticket.adapter';
import { TrainTicketAdapter } from './train-ticket.adapter';
import { TramTicketAdapter } from './tram-ticket.adapter';

@Injectable()
export class TicketAdapterFactory {
  private readonly adapters = new Map<string, (dto: any) => TicketEntity>();

  constructor(
    train: TrainTicketAdapter,
    plane: PlaneTicketAdapter,
    bus: BusTicketAdapter,
    tram: TramTicketAdapter,
  ) {
    this.adapters.set('train', (dto) => train.adapt(dto));
    this.adapters.set('plane', (dto) => plane.adapt(dto));
    this.adapters.set('bus', (dto) => bus.adapt(dto));
    this.adapters.set('tram', (dto) => tram.adapt(dto));
  }

  adapt(dto: TicketBaseDto): TicketEntity {
    const fn = this.adapters.get(dto.kind);
    if (!fn) {
      throw new BadRequestException(
        `No adapter registered for kind: ${dto.kind}`,
      );
    }

    return fn(dto);
  }
}
