import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @ApiProperty({
    type:String,
    description:'Search key (date, sensors value)',
    required:false,
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    type:Number,
    description:'Page number',
    required:false
  })
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsOptional()
  @IsNumber()
  // @Min(1)
  page?: number = 1;

  @ApiProperty({
    type:Number,
    description:'Number of items per page',
    required:false
  })
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({
    type:String,
    description:'Order',
    required:false,
    enum:['DESC','ASC']
  })
  @Transform(({ value }) => {
    const upperValue = value.toUpperCase();
    return upperValue === 'ASC' || upperValue === 'DESC'
      ? upperValue
      : undefined;
  })
  @IsOptional()
  @IsString()
  order: 'DESC' | 'ASC';

  @ApiProperty({
    type:String,
    description:'Start date for filtering (YYYY-MM-DD)',
    required:false
  })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    type:String,
    description:'End date for filtering (YYYY-MM-DD)',
    required:false
  })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
