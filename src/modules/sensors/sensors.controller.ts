import { Controller, Get, Query } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { ApiFoundResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryParamsDto } from 'src/dto/query-params.dto';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SwaggerResponse } from 'src/decorator/swagger-response';

@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get sensors data history' })
  @SwaggerResponse(201,'ds',"grgs",[CreateSensorDto])
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
  @ApiOperation({ summary: 'Get latest sensors data' })
  async getLatest() {
    const data = await this.sensorsService.getLastest();
    return data;
  }

  @Get('count')
  async getCount() {
    const data = await this.sensorsService.countLightGreaterThan800();
    return data;
  }
}
