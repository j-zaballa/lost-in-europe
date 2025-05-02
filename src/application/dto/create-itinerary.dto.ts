import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { BusTicketDto } from './bus-ticket.dto';
import { PlaneTicketDto } from './plane-ticket.dto';
import { TicketBaseDto } from './ticket-base.dto';
import { TrainTicketDto } from './train-ticket.dto';
import { TramTicketDto } from './tram-ticket.dto';

@ApiExtraModels(TrainTicketDto, PlaneTicketDto, BusTicketDto, TramTicketDto)
export class CreateItineraryDto {
  @ApiProperty({
    description: 'Unsorted list of tickets (polymorphic)',
    // oneOf allows Swagger to show the polymorphic schema correctly
    oneOf: [
      { $ref: getSchemaPath(TrainTicketDto) },
      { $ref: getSchemaPath(PlaneTicketDto) },
      { $ref: getSchemaPath(BusTicketDto) },
      { $ref: getSchemaPath(TramTicketDto) },
    ],
    type: 'array',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketBaseDto, {
    discriminator: {
      property: 'kind',
      subTypes: [
        { value: TrainTicketDto, name: 'train' },
        { value: PlaneTicketDto, name: 'plane' },
        { value: BusTicketDto, name: 'bus' },
        { value: TramTicketDto, name: 'tram' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  tickets!: TicketBaseDto[];
}
