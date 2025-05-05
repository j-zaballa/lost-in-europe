import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TicketBaseDto } from './ticket-base.dto';

@ApiExtraModels()
export class BusTicketDto extends TicketBaseDto {
  readonly kind = 'bus' as const;

  @ApiProperty({ example: 'airport', description: 'Bus line or code' })
  @IsString()
  @IsNotEmpty({ message: 'busCode is required for bus tickets' })
  @MaxLength(20)
  busCode!: string;

  @ApiProperty({
    example: '12C',
    description: 'Seat assignment',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  seat?: string;
}
