import { TicketEntity } from './ticket-base.entity';

export class TrainTicketEntity extends TicketEntity {
  readonly kind = 'train' as const;

  constructor(
    from: string,
    to: string,
    public readonly trainNumber: string,
    public readonly seat?: string,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    const seatInfo = this.seat ? `, seat ${this.seat}` : '';
    return `Take train ${this.trainNumber} from ${this.from} to ${this.to}${seatInfo}.`;
  }
}
