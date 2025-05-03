// src/itineraries/itineraries.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { TicketSortService } from 'src/domain/service/ticket-sort.service';
import { v4 as uuidv4 } from 'uuid';
import { TicketAdapterFactory } from '../adapters/ticket-adapter.factory';
import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { ItineraryDto } from '../dto/itinerary.dto';

@Injectable()
export class ItinerariesService {
  constructor(
    private readonly sortService: TicketSortService,
    private readonly ticketAdapter: TicketAdapterFactory,
    // private readonly repo: ItineraryRepository<TicketBaseDto>,
  ) {}

  /**
   * Create a new itinerary from an unsorted array of Ticket DTOs.
   *
   * @param createDto.tickets - unsorted polymorphic Ticket DTOs
   * @returns the itinerary ID plus the *ordered* Ticket DTOs
   * @throws BadRequestException if no itinerary is found
   */
  create(createDto: CreateItineraryDto): ItineraryDto {
    // 1. Order the DTOs by their from/to fields.
    //    SortService only cares about `.from` and `.to`
    const tickets = createDto.tickets.map((ticket) => this.ticketAdapter.adaptToEntity(ticket));
    const orderedTickets = this.sortService.sort(tickets);
    if (!orderedTickets) {
      throw new BadRequestException('No itinerary found');
    }

    // 2. Generate a new itinerary ID
    const id = uuidv4();

    // 3. Persist the raw DTOs (in order) along with metadata
    // const record: ItineraryRecord<TicketBaseDto> = {
    //   id,
    //   tickets: orderedTickets,
    //   createdAt: new Date(),
    // };
    // this.repo.save(record);

    // 4. Return the DTO response
    const ticketDtos = orderedTickets.map((ticket) => this.ticketAdapter.adaptToDto(ticket));
    return { id, tickets: ticketDtos };
  }

  /**
   * Retrieve an existing itinerary by ID.
   *
   * @param id - UUID of the itinerary
   * @throws NotFoundException if no record exists
   */
  findOne(id: string): ItineraryDto {
    // const record = this.repo.findOne(id);
    // if (!record) {
    //   throw new NotFoundException(`Itinerary with ID "${id}" not found`);
    // }
    return { id: '1', tickets: [] };
  }
}
