// src/itineraries/itineraries.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { ItineraryDto } from '../dto/itinerary.dto';
import { TicketBaseDto } from '../dto/ticket-base.dto';
import {
  ItineraryRecord,
  ItineraryRepository,
} from '../persistence/itinerary.repository';

@Injectable()
export class ItinerariesService {
  constructor(
    private readonly sortService: SortService,
    private readonly repo: ItineraryRepository<TicketBaseDto>,
  ) {}

  /**
   * Create a new itinerary from an unsorted array of Ticket DTOs.
   * @param createDto.tickets - unsorted polymorphic Ticket DTOs
   * @returns the itinerary ID plus the *ordered* Ticket DTOs
   */
  create(createDto: CreateItineraryDto): ItineraryDto {
    // 1. Order the DTOs by their from/to fields.
    //    SortService only cares about `.from` and `.to`
    const orderedTickets = this.sortService.sort(createDto.tickets);

    // 2. Generate a new itinerary ID
    const id = uuidv4();

    // 3. Persist the raw DTOs (in order) along with metadata
    const record: ItineraryRecord<TicketBaseDto> = {
      id,
      tickets: orderedTickets,
      createdAt: new Date(),
    };
    this.repo.save(record);

    // 4. Return the DTO response
    return { id, tickets: orderedTickets };
  }

  /**
   * Retrieve an existing itinerary by ID.
   * @param id - UUID of the itinerary
   * @throws NotFoundException if no record exists
   */
  findOne(id: string): ItineraryDto {
    const record = this.repo.findOne(id);
    if (!record) {
      throw new NotFoundException(`Itinerary with ID "${id}" not found`);
    }
    return { id: record.id, tickets: record.tickets };
  }
}
