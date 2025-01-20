import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    example: 'led1',
  })
  @IsString()
  device: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  action: number;
}

