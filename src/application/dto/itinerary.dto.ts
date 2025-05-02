import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { BusTicketDto } from './bus-ticket.dto';
import { PlaneTicketDto } from './plane-ticket.dto';
import { TicketBaseDto } from './ticket-base.dto';
import { TrainTicketDto } from './train-ticket.dto';
import { TramTicketDto } from './tram-ticket.dto';

@ApiExtraModels(TrainTicketDto, PlaneTicketDto, BusTicketDto)
export class ItineraryDto {
  @ApiProperty({ description: 'Unique identifier of the itinerary' })
  id!: string;

  @ApiProperty({
    description: 'Ordered list of tickets',
    oneOf: [
      { $ref: getSchemaPath(TrainTicketDto) },
      { $ref: getSchemaPath(PlaneTicketDto) },
      { $ref: getSchemaPath(BusTicketDto) },
      { $ref: getSchemaPath(TramTicketDto) },
    ],
    type: 'array',
  })
  tickets!: TicketBaseDto[];
}
