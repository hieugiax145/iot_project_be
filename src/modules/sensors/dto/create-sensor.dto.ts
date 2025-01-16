import { IsNumber } from 'class-validator';

export class CreateSensorDto {
  @IsNumber()
  temp: number;
  @IsNumber()
  hum: number;
  @IsNumber()
  light: number;
  @IsNumber()
  dust: number;
}
