import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItinerariesController } from './application/controller/itineraries.controller';
import { ItinerariesService } from './application/service/itineraries.service';
import { HumanReadableService } from './application/service/human-readable.service';
import { TicketSortService } from './domain/service/ticket-sort.service';
import { TrainTicketAdapter } from './application/adapters/train-ticket.adapter';
import { PlaneTicketAdapter } from './application/adapters/plane-ticket.adapter';
import { BusTicketAdapter } from './application/adapters/bus-ticket.adapter';
import { TramTicketAdapter } from './application/adapters/tram-ticket.adapter';
import { TicketAdapterFactory } from './application/adapters/ticket-adapter.factory';

@Module({
  imports: [],
  controllers: [AppController, ItinerariesController],
  providers: [
    AppService,
    ItinerariesService,
    HumanReadableService,
    TicketSortService,
    TrainTicketAdapter,
    PlaneTicketAdapter,
    BusTicketAdapter,
    TramTicketAdapter,
    TicketAdapterFactory,
  ],
})
export class AppModule {}
