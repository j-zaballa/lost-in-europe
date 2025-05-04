import { Module } from '@nestjs/common';
import { InMemoryItineraryRepository } from './in-memory-itinerary-repository';
import { ItineraryRepository } from './itinerary-repository';

@Module({
  providers: [
    {
      provide: ItineraryRepository,
      useClass: InMemoryItineraryRepository,
    },
  ],
  exports: [ItineraryRepository],
})
export class RepositoryModule {}
