import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TicketBaseDto } from './ticket-base.dto';

@ApiExtraModels()
export class TrainTicketDto extends TicketBaseDto {
  readonly kind = 'train' as const;

  @ApiProperty({ example: 'RJX 765', description: 'Train / service number' })
  @IsString()
  @IsNotEmpty({ message: 'trainNumber is required for train tickets' })
  @MaxLength(20)
  trainNumber!: string;

  @ApiProperty({ example: '3', description: 'Platform number' })
  @IsString()
  @IsNotEmpty({ message: 'platform is required for train tickets' })
  @MaxLength(10)
  platform!: string;

  @ApiProperty({ example: '17C' })
  @IsString()
  @IsNotEmpty({ message: 'seat is required for train tickets' })
  @MaxLength(10)
  seat!: string;
}
