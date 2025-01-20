import { Controller, Get, Query } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { QueryParamsDto } from 'src/dto/query-params.dto';
import { Sensor } from './entities/sensor.entity';

@ApiTags('sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get sensors data history' })
  @ApiExtraModels(Sensor)
  @ApiOkResponse({
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(Sensor) },
            },
            currentPage: { type: 'number', example: 1 },
            totalCount: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
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
  @ApiExtraModels(Sensor)
  @ApiOkResponse({
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'object',
          $ref: getSchemaPath(Sensor),
        },
      },
    },
  })
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
