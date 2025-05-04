import { Injectable } from '@nestjs/common';
import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';
import { ItineraryRepository } from './itinerary-repository';

/**
 * In-memory implementation of ItineraryRepository
 */
@Injectable()
export class InMemoryItineraryRepository implements ItineraryRepository {
  private readonly store = new Map<string, ItineraryEntity>();

  save(record: ItineraryEntity): void {
    this.store.set(record.id, record);
  }

  findOne(id: string): ItineraryEntity | undefined {
    return this.store.get(id);
  }
}
