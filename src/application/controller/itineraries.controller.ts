import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { BusTicketDto } from '../dto/bus-ticket.dto';
import { CreateItineraryDto } from '../dto/create-itinerary.dto';
import { ItineraryDto } from '../dto/itinerary.dto';
import { PlaneTicketDto } from '../dto/plane-ticket.dto';
import { TrainTicketDto } from '../dto/train-ticket.dto';
import { HumanReadableService } from '../service/human-readable.service';
import { ItinerariesService } from '../service/itineraries.service';

@ApiTags('itineraries')
@ApiExtraModels(TrainTicketDto, PlaneTicketDto, BusTicketDto)
@Controller('itineraries')
export class ItinerariesController {
  constructor(
    private readonly service: ItinerariesService,
    private readonly renderer: HumanReadableService,
  ) {}

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
            ],
            discriminator: {
              propertyName: 'kind',
              mapping: {
                train: getSchemaPath(TrainTicketDto),
                plane: getSchemaPath(PlaneTicketDto),
                bus: getSchemaPath(BusTicketDto),
              },
            },
          },
        },
      },
    },
  })
  create(@Body() dto: CreateItineraryDto): ItineraryDto {
    /** dto.tickets is already validated & typed thanks to the
          discriminator configured in CreateItineraryDto            */
    return this.service.create(dto.tickets);
  }

  /** -----------------------------------------------------------
   * GET /itineraries/:id?format=json|human
   * - JSON (default) → ItineraryDto
   * - human         → plain‑text narrative
   * ---------------------------------------------------------- */
  @Get(':id')
  @ApiOkResponse({ type: ItineraryDto, description: 'Ordered itinerary' })
  findOne(
    @Param('id') id: string,
    @Query('format') format: 'json' | 'human' = 'json',
    @Res() res: Response,
  ) {
    const itin = this.service.findOne(id);

    if (format === 'human') {
      res.type('text/plain').send(this.renderer.render(itin.tickets));
    } else {
      res.json(itin);
    }
  }
}
