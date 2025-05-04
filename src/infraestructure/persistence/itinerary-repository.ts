import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';

/**
 * Repository abstraction for Itinerary persistence
 */
export abstract class ItineraryRepository {
  abstract save(record: ItineraryEntity): void;
  abstract findOne(id: string): ItineraryEntity | undefined;
}
