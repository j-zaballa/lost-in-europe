import { Module } from '@nestjs/common';
import { OrmItineraryAdapter } from './orm-itinerary.adapter';
import { OrmTicketAdapter } from './orm-ticket.adapter';

@Module({
  providers: [OrmTicketAdapter, OrmItineraryAdapter],
  exports: [OrmTicketAdapter, OrmItineraryAdapter],
})
export class OrmAdaptersModule {}
