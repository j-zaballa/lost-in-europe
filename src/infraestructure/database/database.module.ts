import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryEntity } from './entities/itinerary.entity';
import { TicketEntity } from './entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [TicketEntity, ItineraryEntity],
      synchronize: true, // WARNING: Do not use in production
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
