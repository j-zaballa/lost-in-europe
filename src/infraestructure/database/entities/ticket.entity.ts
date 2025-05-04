import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItineraryEntity } from './itinerary.entity';

/**
 * TypeORM entity for storing tickets in the database
 * Uses single table inheritance to store all ticket types
 */
@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  kind: string; // 'plane', 'train', 'bus', 'tram'

  @Column({ type: 'varchar', length: 100 })
  from: string;

  @Column({ type: 'varchar', length: 100 })
  to: string;

  // Plane ticket fields
  @Column({ type: 'varchar', length: 20, nullable: true })
  flightNumber: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  seat: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gate: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  luggage: string | null;

  // Train ticket fields
  @Column({ type: 'varchar', length: 20, nullable: true })
  trainNumber: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  platform: string | null;

  // Bus ticket fields
  @Column({ type: 'varchar', length: 20, nullable: true })
  busCode: string | null;

  // Tram ticket fields
  @Column({ type: 'varchar', length: 20, nullable: true })
  lineNumber: string | null;

  // Itinerary relationship
  @Column({ nullable: true })
  itineraryId: string | null;

  @ManyToOne(() => ItineraryEntity, (itinerary) => itinerary.tickets)
  @JoinColumn({ name: 'itineraryId' })
  itinerary: ItineraryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
