import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export abstract class TicketBaseDto {
  @ApiProperty({ description: 'Departure city' })
  @IsString()
  from!: string;

  @ApiProperty({ description: 'Arrival city' })
  @IsString()
  to!: string;

  /**
   * Discriminator used by Swagger & validation pipes to detect concrete subtype.
   * Every subclass returns its own literal.
   */
  abstract readonly kind: string;
}
