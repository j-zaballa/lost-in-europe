import { TicketEntity } from './ticket-base.entity';

export class TrainTicketEntity extends TicketEntity {
  readonly kind = 'train' as const;

  constructor(
    from: string,
    to: string,
    public readonly trainNumber: string,
    public readonly platform: string,
    public readonly seat: string,
  ) {
    super(from, to);
  }

  toHumanString(): string {
    return `Board train ${this.trainNumber}, Platform ${this.platform} from ${this.from} to ${this.to}. Seat number ${this.seat}.`;
  }
}
