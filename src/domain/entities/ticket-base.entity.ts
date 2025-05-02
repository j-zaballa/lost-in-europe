/**
 * Abstract base class for all Ticket entities.
 * Implements the shared properties and enforces a human-readable rendering method.
 */
export abstract class TicketEntity {
  constructor(
    public readonly from: string,
    public readonly to: string,
  ) {}

  /**
   * Discriminator for subtype (e.g., 'train', 'plane', 'bus').
   */
  abstract readonly kind: string;

  /**
   * Returns a single-sentence human-readable description of this ticket.
   */
  abstract toHumanString(): string;
}
