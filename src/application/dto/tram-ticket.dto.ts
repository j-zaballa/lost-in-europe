import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TicketBaseDto } from './ticket-base.dto';

@ApiExtraModels()
export class TramTicketDto extends TicketBaseDto {
  readonly kind = 'tram' as const;

  @ApiProperty({ example: 'S5', description: 'Tram / service number' })
  @IsString()
  @IsNotEmpty({ message: 'lineNumber is required for tram tickets' })
  lineNumber!: string;
}
