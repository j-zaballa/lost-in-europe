import { Injectable } from '@nestjs/common';
import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';
import { v4 as uuidv4 } from 'uuid';
import { ItineraryRepository } from './itinerary-repository';

/**
 * In-memory implementation of ItineraryRepository
 */
@Injectable()
export class InMemoryItineraryRepository implements ItineraryRepository {
  private readonly store = new Map<string, ItineraryEntity>();

  save(record: ItineraryEntity): Promise<ItineraryEntity> {
    const id = record.id || uuidv4();

    // If the record doesn't have an ID, set it on the existing instance
    // rather than creating a new one, to maintain reference equality
    if (!record.id) {
      // TypeScript doesn't allow direct modification of readonly properties
      // This is a workaround for testing purposes only
      // Using Object.defineProperty to properly set the id property
      Object.defineProperty(record, 'id', { value: id });
    }

    this.store.set(id, record);
    return Promise.resolve(record);
  }

  findOne(id: string): Promise<ItineraryEntity | undefined> {
    return Promise.resolve(this.store.get(id));
  }
}
