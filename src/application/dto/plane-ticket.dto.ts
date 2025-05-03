import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { ALLOWED_LUGGAGE_METHODS, LuggageCheckInMethod } from 'src/domain/entities/plane-ticket.entity';
import { TicketBaseDto } from './ticket-base.dto';

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
