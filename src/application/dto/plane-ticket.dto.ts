import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { TicketBaseDto } from './ticket-base.dto';

const LUGGAGE_CHECK_IN_METHODS = {
  SELF_CHECK_IN: 'self-check-in',
  AUTOMATIC: 'automatic',
} as const;

const ALLOWED_LUGGAGE_METHODS = Object.values(LUGGAGE_CHECK_IN_METHODS);
type LuggageCheckInMethod = (typeof ALLOWED_LUGGAGE_METHODS)[number];

@ApiExtraModels()
export class PlaneTicketDto extends TicketBaseDto {
  readonly kind = 'plane' as const;

  @ApiProperty({ example: 'IB1234', description: 'Flight number' })
  @IsString()
  flightNumber!: string;

  @ApiProperty({ example: '36A', description: 'Seat assignment' })
  @IsString()
  seat!: string;

  @ApiProperty({ example: 'G12', description: 'Gate' })
  @IsString()
  gate!: string;

  @ApiProperty({
    example: 'self-check-in',
    description: 'Luggage check-in method',
    enum: ALLOWED_LUGGAGE_METHODS,
  })
  @IsIn(ALLOWED_LUGGAGE_METHODS)
  luggage!: LuggageCheckInMethod;
}
