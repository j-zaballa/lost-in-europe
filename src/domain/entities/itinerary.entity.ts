import { randomUUID } from 'crypto';
import { TicketEntity } from './ticket-base.entity';

/**
 * Represents a complete travel itinerary composed of ordered tickets
 */
export class ItineraryEntity {
  /**
   * Unique identifier for the itinerary
   */
  public readonly id: string;

  /**
   * Creation timestamp of the itinerary
   */
  public readonly createdAt: Date;

  constructor(
    /**
     * Ordered collection of tickets forming a complete travel route
     */
    public readonly tickets: TicketEntity[],
    id?: string,
  ) {
    this.id = id || randomUUID();
    this.createdAt = new Date();
  }

  /**
   * Returns a human-readable representation of the complete itinerary
   */
  toHumanString(): string {
    let result = '0. Start.\n';

    this.tickets.forEach((ticket, index) => {
      result += `${index + 1}. ${ticket.toHumanString()}\n`;
    });

    result += `${this.tickets.length + 1}. Last destination reached.`;
    return result;
  }
}
