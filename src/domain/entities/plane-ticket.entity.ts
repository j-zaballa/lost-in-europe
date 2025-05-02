import { TicketEntity } from './ticket-base.entity';

export class PlaneTicketEntity extends TicketEntity {
  readonly kind = 'plane' as const;

  constructor(
    from: string,
    to: string,
    public readonly flightNumber: string,
    public readonly seat?: string,
    public readonly gate?: string,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    const parts: string[] = [];
    parts.push(
      `Take flight ${this.flightNumber} from ${this.from} to ${this.to}`,
    );
    if (this.gate) {
      parts.push(`gate ${this.gate}`);
    }
    if (this.seat) {
      parts.push(`seat ${this.seat}`);
    }
    return parts.join(', ') + '.';
  }
}
