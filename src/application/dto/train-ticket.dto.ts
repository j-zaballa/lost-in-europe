import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TicketBaseDto } from './ticket-base.dto';

@ApiExtraModels()
export class TrainTicketDto extends TicketBaseDto {
  readonly kind = 'train' as const;

  @ApiProperty({ example: 'RJX 765', description: 'Train / service number' })
  @IsString()
  trainNumber!: string;

  @ApiProperty({ example: '3', description: 'Platform number' })
  @IsString()
  platform!: string;

  @ApiProperty({ example: '17C', required: false })
  @IsOptional()
  @IsString()
  seat?: string;
}
