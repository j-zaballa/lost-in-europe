import { TicketEntity } from './ticket-base.entity';

export const LUGGAGE_CHECK_IN_METHODS = {
  SELF_CHECK_IN: 'self-check-in',
  AUTOMATIC: 'automatic',
} as const;

export const ALLOWED_LUGGAGE_METHODS = Object.values(LUGGAGE_CHECK_IN_METHODS);
export type LuggageCheckInMethod = (typeof ALLOWED_LUGGAGE_METHODS)[number];

export class PlaneTicketEntity extends TicketEntity {
  readonly kind = 'plane' as const;

  constructor(
    from: string,
    to: string,
    public readonly flightNumber: string,
    public readonly seat: string,
    public readonly gate: string,
    public readonly luggage: LuggageCheckInMethod,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    const luggageDescription = this.getLiggageDescription();
    return `From ${this.from}, board the flight ${this.flightNumber} to ${this.to} from gate ${this.gate}, seat ${this.seat}. ${luggageDescription}.`;
  }

  private getLiggageDescription() {
    if (this.luggage === 'automatic') {
      return 'Luggage will transfer automatically from the last flight.';
    }

    return 'Self-check-in luggage at counter.';
  }
}
