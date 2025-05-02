import { TicketEntity } from './ticket-base.entity';

export class BusTicketEntity extends TicketEntity {
  readonly kind = 'bus' as const;

  constructor(
    from: string,
    to: string,
    public readonly busCode?: string,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    if (this.busCode) {
      return `Take bus ${this.busCode} from ${this.from} to ${this.to}.`;
    }
    return `Take a bus from ${this.from} to ${this.to}.`;
  }
}
