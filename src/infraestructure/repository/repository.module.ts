import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmAdaptersModule } from '../adapters/orm-adapters.module';
import { ItineraryEntity } from '../database/entities/itinerary.entity';
import { TicketEntity } from '../database/entities/ticket.entity';
import { ItineraryRepository } from './itinerary-repository';
import { TypeOrmItineraryRepository } from './type-orm-itinerary-repository';

@Module({
  imports: [TypeOrmModule.forFeature([ItineraryEntity, TicketEntity]), OrmAdaptersModule],
  providers: [
    {
      provide: ItineraryRepository,
      useClass: TypeOrmItineraryRepository,
    },
  ],
  exports: [ItineraryRepository],
})
export class RepositoryModule {}
