import { IsNumber } from "class-validator";

export class AddSensorsDataDto {
    @IsNumber()
    temp: number;
    @IsNumber()
    hum: number;
    @IsNumber()
    light: number;
}