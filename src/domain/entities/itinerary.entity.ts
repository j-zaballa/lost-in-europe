import { v4 as uuidv4 } from 'uuid';
import { TicketEntity } from './ticket-base.entity';

/**
 * Represents a complete travel itinerary composed of ordered tickets
 */
export class ItineraryEntity {
  /**
   * Unique identifier for the itinerary
   */
  public readonly id: string;

  constructor(
    /**
     * Ordered collection of tickets forming a complete travel route
     */
    public readonly tickets: TicketEntity[],
    id?: string,
  ) {
    this.id = id || uuidv4();
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
