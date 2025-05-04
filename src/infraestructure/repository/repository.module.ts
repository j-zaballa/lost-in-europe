import { Module } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrmAdaptersModule } from '../adapters/orm-adapters.module';
import { OrmItineraryAdapter } from '../adapters/orm-itinerary.adapter';
import { OrmTicketAdapter } from '../adapters/orm-ticket.adapter';
import { ItineraryEntity } from '../database/entities/itinerary.entity';
import { TicketEntity } from '../database/entities/ticket.entity';
import { InMemoryItineraryRepository } from './in-memory-itinerary-repository';
import { ItineraryRepository } from './itinerary-repository';
import { TypeOrmItineraryRepository } from './type-orm-itinerary-repository';

export const conditionalModuleImports = ConditionalModule.registerWhen(
  TypeOrmModule.forFeature([ItineraryEntity, TicketEntity]),
  (env: NodeJS.ProcessEnv) => env['DATABASE_TYPE'] === 'typeorm',
);

export const itineraryRepositoryFactory = (
  itineraryEntityRepository?: Repository<ItineraryEntity>,
  ticketEntityRepository?: Repository<TicketEntity>,
  ticketAdapter?: OrmTicketAdapter,
  itineraryAdapter?: OrmItineraryAdapter,
) => {
  if (
    process.env.DATABASE_TYPE === 'typeorm' &&
    itineraryEntityRepository &&
    ticketEntityRepository &&
    ticketAdapter &&
    itineraryAdapter
  ) {
    return new TypeOrmItineraryRepository(
      itineraryEntityRepository,
      ticketEntityRepository,
      ticketAdapter,
      itineraryAdapter,
    );
  }

  return new InMemoryItineraryRepository();
};

const itineraryRepositoryProvider = {
  provide: ItineraryRepository,
  useFactory: itineraryRepositoryFactory,
  inject: [
    { token: getRepositoryToken(ItineraryEntity), optional: true },
    { token: getRepositoryToken(TicketEntity), optional: true },
    { token: OrmTicketAdapter, optional: true },
    { token: OrmItineraryAdapter, optional: true },
  ],
};
@Module({
  imports: [conditionalModuleImports, OrmAdaptersModule],
  providers: [itineraryRepositoryProvider],
  exports: [ItineraryRepository],
})
export class RepositoryModule {}
