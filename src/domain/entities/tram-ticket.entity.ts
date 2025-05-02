import { TicketEntity } from './ticket-base.entity';

export class TramTicketEntity extends TicketEntity {
  readonly kind = 'tram' as const;

  constructor(
    from: string,
    to: string,
    public readonly lineNumber?: string,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    if (this.lineNumber) {
      return `Take tram ${this.lineNumber} from ${this.from} to ${this.to}.`;
    }
    return `Take a tram from ${this.from} to ${this.to}.`;
  }
}
