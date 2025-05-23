import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusTicketAdapter } from './application/adapters/bus-ticket.adapter';
import { PlaneTicketAdapter } from './application/adapters/plane-ticket.adapter';
import { TicketAdapterFactory } from './application/adapters/ticket-adapter.factory';
import { TrainTicketAdapter } from './application/adapters/train-ticket.adapter';
import { TramTicketAdapter } from './application/adapters/tram-ticket.adapter';
import { ItinerariesController } from './application/controller/itineraries.controller';
import { ItinerariesService } from './application/service/itineraries.service';
import { ItineraryDomainModule } from './domain/itinerary.module';
import { DatabaseModule } from './infraestructure/database/database.module';
import { RepositoryModule } from './infraestructure/repository/repository.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ItineraryDomainModule, RepositoryModule, DatabaseModule],
  controllers: [AppController, ItinerariesController],
  providers: [
    AppService,
    ItinerariesService,
    TrainTicketAdapter,
    PlaneTicketAdapter,
    BusTicketAdapter,
    TramTicketAdapter,
    TicketAdapterFactory,
  ],
})
export class AppModule {}
