import { Injectable } from '@nestjs/common';
import { ItineraryEntity as ItineraryDomain } from 'src/domain/entities/itinerary.entity';
import { ItineraryEntity as ItineraryOrm } from '../database/entities/itinerary.entity';
import { OrmTicketAdapter } from './orm-ticket.adapter';

/**
 * Adapter for converting between ORM itinerary entities and domain itinerary entities
 */
@Injectable()
export class OrmItineraryAdapter {
  constructor(private readonly ticketAdapter: OrmTicketAdapter) {}

  /**
   * Converts an ORM itinerary entity to a domain itinerary entity
   */
  adaptToDomain(ormItinerary: ItineraryOrm): ItineraryDomain {
    if (!ormItinerary.tickets) {
      return new ItineraryDomain([], ormItinerary.id);
    }

    const domainTickets = ormItinerary.tickets.map((ticket) => this.ticketAdapter.adaptToDomain(ticket));

    return new ItineraryDomain(domainTickets, ormItinerary.id);
  }

  /**
   * Converts a domain itinerary entity to an ORM itinerary entity
   * Note: This does not convert tickets - they need to be handled separately
   */
  adaptToOrm(domainItinerary: ItineraryDomain): ItineraryOrm {
    const ormItinerary = new ItineraryOrm();

    // Only set the ID if the domain entity has a non-empty ID
    if (domainItinerary.id && domainItinerary.id.length > 0) {
      ormItinerary.id = domainItinerary.id;
    }

    return ormItinerary;
  }
}
