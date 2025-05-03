import { TicketEntity } from './ticket-base.entity';

export class BusTicketEntity extends TicketEntity {
  readonly kind = 'bus' as const;

  constructor(
    from: string,
    to: string,
    public readonly busCode: string,
    public readonly seat?: string,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    const seatDescription = this.getSeatDescription();
    return `Board the ${this.busCode} bus from ${this.from} to ${this.to}. ${seatDescription}.`;
  }

  private getSeatDescription() {
    if (this.seat) {
      return `Seat ${this.seat}`;
    }
    return 'No seat assignment';
  }
}
