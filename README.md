# Lost in Europe

## Project setup

### Clone the repository

```bash
$ git clone https://github.com/j-zaballa/lost-in-europe.git
```

### Install dependencies

```bash
$ npm install
```

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug
```

### Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Documentation

With the project running, visit http://localhost:3000/docs to see the API documentation. You can also use the Swagger UI to test the API. You can find sample test data in the `sample-data` folder.

## Usage

### Create an itinerary

```bash
curl -X 'POST' \
  'http://localhost:3000/itineraries' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "tickets": [
    {
      "kind": "plane",
      "from": "Bologna Airport",
      "to": "Paris",
      "flightNumber": "AF1229",
      "gate": "22",
      "seat": "10A",
      "luggage": "self-check-in"
    },
    {
      "kind": "train",
      "from": "Venice",
      "to": "Bologna",
      "trainNumber": "ICN 35780",
      "platform": "1",
      "seat": "13F"
    },
    {
      "kind": "plane",
      "from": "Paris",
      "to": "Chicago",
      "flightNumber": "AF136",
      "gate": "32",
      "seat": "10A",
      "luggage": "automatic"
    },
    {
      "kind": "tram",
      "from": "Innsbruck",
      "to": "Innsbruck Airport",
      "lineNumber": "S5"
    },
    {
      "kind": "bus",
      "from": "Bologna",
      "to": "Bologna Airport",
      "busCode": "BLQ12"
    },
    {
      "kind": "train",
      "from": "St. Anton am Arlberg",
      "to": "Innsbruck",
      "trainNumber": "RJX 765",
      "platform": "3",
      "seat": "17C"
    },
    {
      "kind": "plane",
      "from": "Innsbruck Airport",
      "to": "Venice",
      "flightNumber": "AA904",
      "gate": "10",
      "seat": "18B",
      "luggage": "self-check-in"
    }
  ]
}
'
```

Output:

```json
{
  "id": "e8c2b492-2849-4274-9dba-2888ae771732",
  "tickets": [
    {
      "from": "St. Anton am Arlberg",
      "to": "Innsbruck",
      "kind": "train",
      "trainNumber": "RJX 765",
      "platform": "3",
      "seat": "17C"
    },
    {
      "from": "Innsbruck",
      "to": "Innsbruck Airport",
      "kind": "tram",
      "lineNumber": "S5"
    },
    {
      "from": "Innsbruck Airport",
      "to": "Venice",
      "kind": "plane",
      "flightNumber": "AA904",
      "seat": "18B",
      "gate": "10",
      "luggage": "self-check-in"
    },
    {
      "from": "Venice",
      "to": "Bologna",
      "kind": "train",
      "trainNumber": "ICN 35780",
      "platform": "1",
      "seat": "13F"
    },
    {
      "from": "Bologna",
      "to": "Bologna Airport",
      "kind": "bus",
      "busCode": "BLQ12"
    },
    {
      "from": "Bologna Airport",
      "to": "Paris",
      "kind": "plane",
      "flightNumber": "AF1229",
      "seat": "10A",
      "gate": "22",
      "luggage": "self-check-in"
    },
    {
      "from": "Paris",
      "to": "Chicago",
      "kind": "plane",
      "flightNumber": "AF136",
      "seat": "10A",
      "gate": "32",
      "luggage": "automatic"
    }
  ]
}
```

### Get an itinerary

Get the ID from the previous response and use it to get the itinerary in JSON or human readable format.

JSON format:

```bash
curl -X 'GET' \
  'http://localhost:3000/itineraries/e8c2b492-2849-4274-9dba-2888ae771732?format=json' \
  -H 'accept: application/json'
```

Output:

```json
{
  "id": "e8c2b492-2849-4274-9dba-2888ae771732",
  "tickets": [
    {
      "from": "St. Anton am Arlberg",
      "to": "Innsbruck",
      "kind": "train",
      "trainNumber": "RJX 765",
      "platform": "3",
      "seat": "17C"
    },
    {
      "from": "Innsbruck",
      "to": "Innsbruck Airport",
      "kind": "tram",
      "lineNumber": "S5"
    },
    {
      "from": "Innsbruck Airport",
      "to": "Venice",
      "kind": "plane",
      "flightNumber": "AA904",
      "seat": "18B",
      "gate": "10",
      "luggage": "self-check-in"
    },
    {
      "from": "Venice",
      "to": "Bologna",
      "kind": "train",
      "trainNumber": "ICN 35780",
      "platform": "1",
      "seat": "13F"
    },
    {
      "from": "Bologna",
      "to": "Bologna Airport",
      "kind": "bus",
      "busCode": "BLQ12"
    },
    {
      "from": "Bologna Airport",
      "to": "Paris",
      "kind": "plane",
      "flightNumber": "AF1229",
      "seat": "10A",
      "gate": "22",
      "luggage": "self-check-in"
    },
    {
      "from": "Paris",
      "to": "Chicago",
      "kind": "plane",
      "flightNumber": "AF136",
      "seat": "10A",
      "gate": "32",
      "luggage": "automatic"
    }
  ]
}
```

Human readable format:

```bash
curl -X 'GET' \
  'http://localhost:3000/itineraries/e8c2b492-2849-4274-9dba-2888ae771732?format=human' \
  -H 'accept: text/plain'
```

Output:

```
0. Start.
1. Board train RJX 765, Platform 3 from St. Anton am Arlberg to Innsbruck. Seat number 17C.
2. Board the Tram S5 from Innsbruck to Innsbruck Airport.
3. From Innsbruck Airport, board the flight AA904 to Venice from gate 10, seat 18B. Self-check-in luggage at counter.
4. Board train ICN 35780, Platform 1 from Venice to Bologna. Seat number 13F.
5. Board the BLQ12 bus from Bologna to Bologna Airport. No seat assignment.
6. From Bologna Airport, board the flight AF1229 to Paris from gate 22, seat 10A. Self-check-in luggage at counter.
7. From Paris, board the flight AF136 to Chicago from gate 32, seat 10A. Luggage will transfer automatically from the last flight.
8. Last destination reached.
```

## Assumptions

- The train ticket seat is mandatory event though there are train tickets without a seat number in real life
- The luggage mode in plane tickets is either automatic or self-check-in
- The `from` and `to` fields are strings, not locations. So the user must provide the correct location names and spell them exactly the same every time
- It would be normal to assume that Kevin's tickets path is a semi-Eulerian path, because the family holiday has already started and they are already away from home. But the API also works for closed Eulerian paths. Kevin would have to work out the starting point of the given path given his current location

## Add New Ticket Types

We have adopted a polymorphic approach to the ticket types and endorsed the open/closed principle so we can add new ticket types without modifying the existing entities and DTOs.

To add a new ticket type, you need to:

1. **Create a new domain entity class** in `src/domain/entities/`:

   - Create a file like `new-ticket.entity.ts`
   - Extend the `TicketEntity` base class
   - Implement the required `kind` property and `toHumanString()` method
   - Add any ticket-specific properties

2. **Create a new DTO** in `src/application/dto/`:

   - Create a file like `new-ticket.dto.ts`
   - Extend the `TicketBaseDto` abstract class
   - Define the `kind` property with a unique string
   - Add validation decorators to ticket-specific fields
   - Use Swagger decorators for API documentation

3. **Create a new adapter** in `src/application/adapters/`:

   - Create a file like `new-ticket.adapter.ts`
   - Implement the `TicketAdapter` interface
   - Create mapping logic between DTO and entity

4. **Update the adapter factory** in `src/application/adapters/ticket-adapter.factory.ts`:

   - Add the new adapter to the constructor parameters
   - Register the new adapter in the entityAdapters and dtoAdapters maps

5. **Update the ORM adapter** in `src/infraestructure/adapters/orm-ticket.adapter.ts`:

   - Add a new case in the `adaptToDomain` method to handle the new ticket type
   - Add a new case in the `adaptToOrm` method to convert from domain entity to ORM entity
   - Ensure all specific fields are properly mapped in both directions

6. **Update the database entity** in `src/infraestructure/database/entities/ticket.entity.ts`:

   - Add any new fields needed for the new ticket type
   - Consider adding appropriate indices or constraints

7. **Update the create itinerary DTO** in `src/application/dto/create-itinerary.dto.ts`:

   - Add import for the new DTO
   - Add the new DTO to the `@ApiExtraModels` decorator
   - Add the new DTO ref to the `oneOf` array
   - Add the new ticket type to the discriminator subTypes array

8. **Update the itinerary DTO** in `src/application/dto/itinerary.dto.ts`:

   - Add import for the new DTO
   - Add the new DTO to the `oneOf` array

9. **Update the controller** in `src/application/controller/itineraries.controller.ts`:

   - Add the new DTO to the `@ApiExtraModels` decorator
   - Add the new DTO ref to the API mapping

10. **Register the new adapter in** `src/app.module.ts`:

    - Import the new adapter
    - Add it to the providers array

11. **Update the tests**:
    - Add unit tests for the new entity in `src/domain/entities/__tests__/`
    - Add unit tests for the new DTO adapter in `src/application/adapters/__tests__/`
    - Update ORM adapter tests in `src/infraestructure/adapters/__tests__/orm-ticket.adapter.spec.ts`
    - Ensure all your tests pass and maintain high coverage

## API Contract

### Base Ticket DTO

```typescript
export abstract class TicketBaseDto {
  @IsString()
  @IsNotEmpty({ message: 'from is required for all tickets' })
  from!: string;

  @IsString()
  @IsNotEmpty({ message: 'to is required for all tickets' })
  to!: string;

  /**
   * Discriminator used by validation pipes to detect concrete subtype.
   * Every subclass returns its own literal.
   */
  @IsString()
  @IsNotEmpty({ message: 'kind is required for all tickets' })
  abstract readonly kind: string;
}
```

### Plane Ticket DTO

```typescript
export class PlaneTicketDto extends TicketBaseDto {
  readonly kind = 'plane' as const;

  @IsString()
  @IsNotEmpty({ message: 'flightNumber is required for plane tickets' })
  flightNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'seat is required for plane tickets' })
  seat!: string;

  @IsString()
  @IsNotEmpty({ message: 'gate is required for plane tickets' })
  gate!: string;

  @IsIn(['self-check-in', 'automatic'])
  luggage!: LuggageCheckInMethod;
}
```

### Train Ticket DTO

```typescript
export class TrainTicketDto extends TicketBaseDto {
  readonly kind = 'train' as const;

  @IsString()
  @IsNotEmpty({ message: 'trainNumber is required for train tickets' })
  trainNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'platform is required for train tickets' })
  platform!: string;

  @IsString()
  @IsNotEmpty({ message: 'seat is required for train tickets' })
  seat!: string;
}
```

### Bus Ticket DTO

```typescript
export class BusTicketDto extends TicketBaseDto {
  readonly kind = 'bus' as const;

  @IsString()
  @IsNotEmpty({ message: 'busCode is required for bus tickets' })
  busCode!: string;

  @IsOptional()
  @IsString()
  seat?: string;
}
```

### Tram Ticket DTO

```typescript
export class TramTicketDto extends TicketBaseDto {
  readonly kind = 'tram' as const;

  @IsString()
  @IsNotEmpty({ message: 'lineNumber is required for tram tickets' })
  lineNumber!: string;
}
```

### Create Itinerary DTO

```typescript
export class CreateItineraryDto {
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
```

### Itinerary DTO

```typescript
export class ItineraryDto {
  id!: string;
  tickets!: TicketBaseDto[];
}
```

## Repository Implementation Configuration

The application supports dynamic repository implementation selection via environment variables. This allows you to switch between different storage mechanisms without code changes.

### Available Repository Implementations

- **TypeOrmItineraryRepository**: Stores data in a SQL database using TypeORM
- **InMemoryItineraryRepository**: Stores data in memory (useful for testing or development)

### Configuration

Set the `DATABASE_TYPE` environment variable to choose the repository implementation:

```bash
# Use TypeORM implementation
DATABASE_TYPE=typeorm npm run start:dev

# Use In-Memory implementation
DATABASE_TYPE=in-memory npm run start:dev
```

We can also set the variable in the `.env` file.

```
# /.env
DATABASE_TYPE=typeorm # or in-memory
```

If no `DATABASE_TYPE` is specified, the application defaults to the in-memory implementation.
