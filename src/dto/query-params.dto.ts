import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class QueryParamsDto{
    @Transform(({value})=>(value ? parseInt(value) : undefined))
    @IsOptional()
    @IsNumber()
    // @Min(1)
    page?:number=1

    @Transform(({value})=>(value ? parseInt(value) : undefined))
    @IsOptional()
    @IsNumber()
    limit?:number=10

    @Transform(({ value }) => {
        const upperValue = value.toUpperCase();
        return upperValue === 'ASC' || upperValue === 'DESC' ? upperValue : undefined;
      })
    @IsOptional()
    @IsString()
    order:'DESC'| 'ASC'

}