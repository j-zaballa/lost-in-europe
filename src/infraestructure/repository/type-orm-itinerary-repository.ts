import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItineraryEntity as ItineraryEntityDomain } from 'src/domain/entities/itinerary.entity';
import { DataSource, Repository } from 'typeorm';
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
    private readonly ticketAdapter: OrmTicketAdapter,
    private readonly itineraryAdapter: OrmItineraryAdapter,
    private dataSource: DataSource,
  ) {}

  async save(record: ItineraryEntityDomain): Promise<ItineraryEntityDomain> {
    // Create a transaction using the QueryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Convert domain itinerary to ORM itinerary
      const ormItinerary = this.itineraryAdapter.adaptToOrm(record);

      // Save the itinerary first to get the ID
      const savedItinerary = await queryRunner.manager.save(ItineraryEntityOrm, ormItinerary);

      // Save each ticket and associate it with the itinerary
      for (const domainTicket of record.tickets) {
        // Use the adapter to convert domain ticket to ORM ticket
        const ormTicket = this.ticketAdapter.adaptToOrm(domainTicket, savedItinerary.id);
        await queryRunner.manager.save(TicketEntityOrm, ormTicket);
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Fetch the complete itinerary with tickets
      const result = await this.itinerariesRepository.findOne({
        where: { id: savedItinerary.id },
        relations: ['tickets'],
      });

      if (!result) {
        throw new NotFoundException(`Failed to retrieve saved itinerary with ID ${savedItinerary.id}`);
      }

      // Convert back to domain entity using the adapter
      return this.itineraryAdapter.adaptToDomain(result);
    } catch (error) {
      // If we encounter an error, roll back the transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Always release the query runner regardless of success or failure
      await queryRunner.release();
    }
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
