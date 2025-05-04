import { Injectable } from '@nestjs/common';
import { BusTicketEntity as BusTicketDomain } from 'src/domain/entities/bus-ticket.entity';
import {
  LUGGAGE_CHECK_IN_METHODS,
  LuggageCheckInMethod,
  PlaneTicketEntity as PlaneTicketDomain,
} from 'src/domain/entities/plane-ticket.entity';
import { TicketEntity as TicketDomain } from 'src/domain/entities/ticket-base.entity';
import { TrainTicketEntity as TrainTicketDomain } from 'src/domain/entities/train-ticket.entity';
import { TramTicketEntity as TramTicketDomain } from 'src/domain/entities/tram-ticket.entity';
import { TicketEntity as TicketOrm } from '../database/entities/ticket.entity';

/**
 * Adapter for converting ORM ticket entities to domain ticket entities
 */
@Injectable()
export class OrmTicketAdapter {
  /**
   * Converts an ORM ticket entity to a domain ticket entity
   */
  adaptToDomain(ormTicket: TicketOrm): TicketDomain {
    switch (ormTicket.kind) {
      case 'train':
        return new TrainTicketDomain(
          ormTicket.from,
          ormTicket.to,
          ormTicket.trainNumber || '',
          ormTicket.platform || '',
          ormTicket.seat || '',
        );

      case 'plane':
        return new PlaneTicketDomain(
          ormTicket.from,
          ormTicket.to,
          ormTicket.flightNumber || '',
          ormTicket.seat || '',
          ormTicket.gate || '',
          this.mapLuggageMethod(ormTicket.luggage || ''),
        );

      case 'bus':
        return new BusTicketDomain(ormTicket.from, ormTicket.to, ormTicket.busCode || '', ormTicket.seat || '');

      case 'tram':
        return new TramTicketDomain(ormTicket.from, ormTicket.to, ormTicket.lineNumber || '');

      default:
        throw new Error(`Unknown ticket kind: ${ormTicket.kind}`);
    }
  }

  /**
   * Converts a domain ticket entity to an ORM ticket entity
   */
  adaptToOrm(domainTicket: TicketDomain, itineraryId?: string): TicketOrm {
    const ormTicket = new TicketOrm();

    // Set common fields
    ormTicket.from = domainTicket.from;
    ormTicket.to = domainTicket.to;
    ormTicket.kind = domainTicket.kind;

    // Set itinerary ID if provided
    if (itineraryId) {
      ormTicket.itineraryId = itineraryId;
    } else {
      ormTicket.itineraryId = null;
    }

    // Initialize all nullable fields with null
    ormTicket.trainNumber = null;
    ormTicket.platform = null;
    ormTicket.seat = null;
    ormTicket.flightNumber = null;
    ormTicket.gate = null;
    ormTicket.luggage = null;
    ormTicket.busCode = null;
    ormTicket.lineNumber = null;

    // Set specific fields based on ticket type
    switch (domainTicket.kind) {
      case 'train': {
        const trainTicket = domainTicket as TrainTicketDomain;
        ormTicket.trainNumber = trainTicket.trainNumber;
        ormTicket.platform = trainTicket.platform;
        ormTicket.seat = trainTicket.seat;
        break;
      }
      case 'plane': {
        const planeTicket = domainTicket as PlaneTicketDomain;
        ormTicket.flightNumber = planeTicket.flightNumber;
        ormTicket.seat = planeTicket.seat;
        ormTicket.gate = planeTicket.gate;

        // Set luggage using the string value (safe cast because we know the enum values)
        const luggageValue: string = planeTicket.luggage;
        ormTicket.luggage = luggageValue;
        break;
      }
      case 'bus': {
        const busTicket = domainTicket as BusTicketDomain;
        ormTicket.busCode = busTicket.busCode;
        ormTicket.seat = busTicket.seat || null;
        break;
      }
      case 'tram': {
        const tramTicket = domainTicket as TramTicketDomain;
        ormTicket.lineNumber = tramTicket.lineNumber;
        break;
      }
    }

    return ormTicket;
  }

  /**
   * Maps a string luggage method to the correct enum value
   */
  private mapLuggageMethod(luggageMethod: string): LuggageCheckInMethod {
    if (luggageMethod === LUGGAGE_CHECK_IN_METHODS.AUTOMATIC) {
      return LUGGAGE_CHECK_IN_METHODS.AUTOMATIC;
    }
    return LUGGAGE_CHECK_IN_METHODS.SELF_CHECK_IN;
  }
}
