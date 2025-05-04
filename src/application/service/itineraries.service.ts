// src/itineraries/itineraries.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';
import { TicketSortService } from 'src/domain/service/ticket-sort.service';
import { ItineraryRepository } from 'src/infraestructure/repository/itinerary-repository';
import { TicketAdapterFactory } from '../adapters/ticket-adapter.factory';
import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { ItineraryDto } from '../dto/itinerary.dto';

@Injectable()
export class ItinerariesService {
  constructor(
    private readonly sortService: TicketSortService,
    private readonly ticketAdapter: TicketAdapterFactory,
    private readonly repo: ItineraryRepository,
  ) {}

  /**
   * Create a new itinerary from an unsorted array of Ticket DTOs.
   *
   * @param createDto.tickets - unsorted polymorphic Ticket DTOs
   * @returns the itinerary ID plus the *ordered* Ticket DTOs
   * @throws BadRequestException if no itinerary is found
   */
  async create(createDto: CreateItineraryDto): Promise<ItineraryDto> {
    // 1. Order the DTOs by their from/to fields.
    //    SortService only cares about `.from` and `.to`
    const tickets = createDto.tickets.map((ticket) => this.ticketAdapter.adaptToEntity(ticket));
    const orderedTickets = this.sortService.sort(tickets);
    if (!orderedTickets) {
      throw new BadRequestException('Invalid itinerary');
    }

    // 3. Persist the itinerary
    const itinerary = new ItineraryEntity(orderedTickets);
    const savedItinerary = await this.repo.save(itinerary);

    // 4. Return the DTO response
    const ticketDtos = savedItinerary.tickets.map((ticket) => this.ticketAdapter.adaptToDto(ticket));
    const itineraryDto = { id: savedItinerary.id, tickets: ticketDtos };
    return itineraryDto;
  }

  /**
   * Retrieve an existing itinerary by ID.
   *
   * @param id - UUID of the itinerary
   * @throws NotFoundException if no record exists
   */
  async findOne(id: string): Promise<ItineraryDto> {
    const record = await this.repo.findOne(id);
    if (!record) {
      throw new NotFoundException(`Itinerary with ID "${id}" not found`);
    }

    const ticketDtos = record.tickets.map((ticket) => this.ticketAdapter.adaptToDto(ticket));
    return { id: record.id, tickets: ticketDtos };
  }

  /**
   * Print an itinerary in a human-readable format.
   *
   * @param id - UUID of the itinerary
   * @returns a human-readable string
   * @throws NotFoundException if no record exists
   */
  async printItinerary(id: string): Promise<string> {
    const record = await this.repo.findOne(id);
    if (!record) {
      throw new NotFoundException(`Itinerary with ID "${id}" not found`);
    }

    return record.toHumanString();
  }
}
