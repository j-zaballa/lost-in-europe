import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TicketEntity } from './ticket.entity';

/**
 * TypeORM entity for storing itineraries in the database
 */
@Entity('itineraries')
export class ItineraryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => TicketEntity, (ticket) => ticket.itinerary, { eager: true })
  tickets: TicketEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
