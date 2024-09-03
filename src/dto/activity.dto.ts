import { IsInt, IsString } from "class-validator";

export class ActivityDto{
    @IsString()
    device:string='led'

    @IsInt()
    action:number
}