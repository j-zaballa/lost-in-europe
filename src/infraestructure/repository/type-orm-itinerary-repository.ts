import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItineraryEntity as ItineraryEntityDomain } from 'src/domain/entities/itinerary.entity';
import { Repository } from 'typeorm';
import { OrmItineraryAdapter } from '../adapters/orm-itinerary.adapter';
import { OrmTicketAdapter } from '../adapters/orm-ticket.adapter';
import { ItineraryEntity as ItineraryEntityOrm } from '../database/entities/itinerary.entity';
import { TicketEntity as TicketEntityOrm } from '../database/entities/ticket.entity';
import { ItineraryRepository } from './itinerary-repository';

@Injectable()
export class TypeOrmItineraryRepository implements ItineraryRepository {
  constructor(
    @InjectRepository(ItineraryEntityOrm)
    private itinerariesRepository: Repository<ItineraryEntityOrm>,
    @InjectRepository(TicketEntityOrm)
    private ticketsRepository: Repository<TicketEntityOrm>,
    private readonly ticketAdapter: OrmTicketAdapter,
    private readonly itineraryAdapter: OrmItineraryAdapter,
  ) {}

  async save(record: ItineraryEntityDomain): Promise<ItineraryEntityDomain> {
    // Convert domain itinerary to ORM itinerary
    const ormItinerary = this.itineraryAdapter.adaptToOrm(record);

    // Save the itinerary first to get the ID
    const savedItinerary = await this.itinerariesRepository.save(ormItinerary);

    // Save each ticket and associate it with the itinerary
    const ticketPromises = record.tickets.map(async (domainTicket) => {
      // Use the adapter to convert domain ticket to ORM ticket
      const ormTicket = this.ticketAdapter.adaptToOrm(domainTicket, savedItinerary.id);
      return this.ticketsRepository.save(ormTicket);
    });

    await Promise.all(ticketPromises);

    // Fetch the complete itinerary with tickets
    const result = await this.itinerariesRepository.findOne({
      where: { id: savedItinerary.id },
      relations: ['tickets'],
    });

    if (!result) {
      throw new Error(`Failed to retrieve saved itinerary with ID ${savedItinerary.id}`);
    }

    // Convert back to domain entity using the adapter
    return this.itineraryAdapter.adaptToDomain(result);
  }

  async findOne(id: string): Promise<ItineraryEntityDomain | undefined> {
    const result = await this.itinerariesRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });

    if (!result) {
      return undefined;
    }

    // Convert to domain entity using the adapter
    return this.itineraryAdapter.adaptToDomain(result);
  }
}
