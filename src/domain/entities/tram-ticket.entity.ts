import { TicketEntity } from './ticket-base.entity';

export class TramTicketEntity extends TicketEntity {
  readonly kind = 'tram' as const;

  constructor(
    from: string,
    to: string,
    public readonly lineNumber: string,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    return `Board the Tram ${this.lineNumber} from ${this.from} to ${this.to}.`;
  }
}
