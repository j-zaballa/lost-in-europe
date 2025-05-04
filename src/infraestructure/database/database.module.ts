import { Module } from '@nestjs/common';
import { ConditionalModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItineraryEntity } from './entities/itinerary.entity';
import { TicketEntity } from './entities/ticket.entity';

const conditionalModuleImports = ConditionalModule.registerWhen(
  TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [TicketEntity, ItineraryEntity],
      synchronize: true, // WARNING: Do not use in production
    }),
  }),
  (env: NodeJS.ProcessEnv) => env['DATABASE_TYPE'] === 'typeorm',
);

@Module({
  imports: [conditionalModuleImports],
})
export class DatabaseModule {}
