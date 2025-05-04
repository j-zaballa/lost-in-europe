import { Module } from '@nestjs/common';
import { TicketSortService } from './service/ticket-sort.service';

/**
 * Domain module that organizes all itinerary-related domain logic
 * This includes ticket sorting algorithms and domain entities
 */
@Module({
  providers: [TicketSortService],
  exports: [TicketSortService],
})
export class ItineraryDomainModule {}
