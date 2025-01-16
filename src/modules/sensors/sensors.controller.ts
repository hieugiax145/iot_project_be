import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryParamsDto } from 'src/dto/query-params.dto';


@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
      @ApiQuery({ name: 'endDate', type: String, description: 'End date for filtering (YYYY-MM-DD)', required: false })
      @ApiQuery({ name: 'startDate', type: String, description: 'Start date for filtering (YYYY-MM-DD)', required: false })
      @ApiQuery({ name: 'order', enum: ['ASC', 'DESC'], description: 'Order direction for sorting', required: false })
      @ApiQuery({ name: 'limit', type: Number, description: 'Number of items per page', required: false })
      @ApiQuery({ name: 'page', type: Number, description: 'Page number for pagination', required: false })
      @ApiQuery({ name: 'keyword', type: String ,description: 'Search key', required: false })
      async getAllSensorsData(@Query() query: QueryParamsDto) {
          const data = await this.sensorsService.getData(query);
          const totalCount = await this.sensorsService.getTotalCount(query);
          return {
              items: data,
              currentPage: query.page,
              totalCount: totalCount,
          };
      }
  
      @Get('latest')
      async getLatest() {
          const data = await this.sensorsService.getLastest();
          return data
      }
  
      @Get('count')
      async getCount(){
          const data=await this.sensorsService.countLightGreaterThan800();
          return data
      }
}
