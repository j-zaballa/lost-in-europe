import { ItineraryEntity } from 'src/domain/entities/itinerary.entity';

/**
 * Repository abstraction for Itinerary persistence
 */
export abstract class ItineraryRepository {
  abstract save(record: ItineraryEntity): Promise<ItineraryEntity>;
  abstract findOne(id: string): Promise<ItineraryEntity | undefined>;
}
