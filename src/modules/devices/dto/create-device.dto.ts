import { HttpCode } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { IResponse } from 'src/core/transform.interceptor';

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

export class CreateDeviceDtoResponse<T> {
  @ApiProperty({
    example:HttpCode
  })
  statusCode: number;
  @ApiProperty({example:'Success'})
  message: string;
  @ApiProperty({type:"object"})
  data: [T];
}

