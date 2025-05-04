import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export abstract class TicketBaseDto {
  @ApiProperty({ example: 'Paris', description: 'Departure location' })
  @IsString()
  @IsNotEmpty({ message: 'from is required for all tickets' })
  from!: string;

  @ApiProperty({ example: 'London', description: 'Arrival location' })
  @IsString()
  @IsNotEmpty({ message: 'to is required for all tickets' })
  to!: string;

  /**
   * Discriminator used by Swagger & validation pipes to detect concrete subtype.
   * Every subclass returns its own literal.
   */
  @ApiProperty({ example: 'plane', description: 'Ticket type' })
  @IsString()
  @IsNotEmpty({ message: 'kind is required for all tickets' })
  abstract readonly kind: string;
}
