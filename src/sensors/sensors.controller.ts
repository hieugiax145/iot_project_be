import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { QueryParamsDto } from '../dto/query-params.dto';

@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
    constructor(private readonly sensorsService: SensorsService) { }

    @Get()
    @ApiQuery({ name: 'page', type: Number, description: 'Page number for pagination', required: false })
    @ApiQuery({ name: 'limit', type: Number, description: 'Number of items per page', required: false })
    @ApiQuery({ name: 'order', enum: ['ASC', 'DESC'], description: 'Order direction for sorting', required: false })
    async getAllSensorsData(@Query() query: QueryParamsDto) {
        const data = await this.sensorsService.getAll(query);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: data,
            currentPage: query.page,
            totalCount: data.length,
        };
    }

    @Get('latest')
    async getLatest(){
        const data = await this.sensorsService.getLastest();
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: data
        }
    }
}
