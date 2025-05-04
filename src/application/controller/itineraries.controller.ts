import { Body, Controller, Get, Param, Post, Query, Res, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'express';
import { BusTicketDto } from '../dto/bus-ticket.dto';
import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { ItineraryDto } from '../dto/itinerary.dto';
import { PlaneTicketDto } from '../dto/plane-ticket.dto';
import { TrainTicketDto } from '../dto/train-ticket.dto';
import { TramTicketDto } from '../dto/tram-ticket.dto';
import { ItinerariesService } from '../service/itineraries.service';

@ApiTags('itineraries')
@ApiExtraModels(TrainTicketDto, PlaneTicketDto, BusTicketDto, TramTicketDto)
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly service: ItinerariesService) {}

  /** -----------------------------------------------------------
   * POST /itineraries
   * Body : CreateItineraryDto  (polymorphic array of tickets)
   *  └─ Validates & sorts, then persists the itinerary
   * Returns : ItineraryDto  (id + ordered tickets)
   * ---------------------------------------------------------- */
  @Post()
  @ApiCreatedResponse({ type: ItineraryDto })
  @ApiBody({
    description: 'Unsorted list of tickets (polymorphic)',
    schema: {
      type: 'object',
      properties: {
        tickets: {
          type: 'array',
          items: {
            oneOf: [
              { $ref: getSchemaPath(TrainTicketDto) },
              { $ref: getSchemaPath(PlaneTicketDto) },
              { $ref: getSchemaPath(BusTicketDto) },
              { $ref: getSchemaPath(TramTicketDto) },
            ],
            discriminator: {
              propertyName: 'kind',
              mapping: {
                train: getSchemaPath(TrainTicketDto),
                plane: getSchemaPath(PlaneTicketDto),
                bus: getSchemaPath(BusTicketDto),
                tram: getSchemaPath(TramTicketDto),
              },
            },
          },
        },
      },
    },
  })
  create(@Body(new ValidationPipe()) dto: CreateItineraryDto): ItineraryDto {
    return this.service.create(dto);
  }

  /** -----------------------------------------------------------
   * GET /itineraries/:id?format=json|human
   * - JSON (default) → ItineraryDto
   * - human         → plain‑text narrative
   * ---------------------------------------------------------- */
  @Get(':id')
  @ApiOkResponse({ type: ItineraryDto, description: 'Ordered itinerary' })
  findOne(@Param('id') id: string, @Query('format') format: 'json' | 'human' = 'json', @Res() res: Response) {
    if (format === 'human') {
      const itineraryString = this.service.printItinerary(id);
      res.type('text/plain').send(itineraryString);
    } else {
      const itinerary = this.service.findOne(id);
      res.json(itinerary);
    }
  }
}
