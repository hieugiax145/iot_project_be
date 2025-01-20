import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { MqttService } from 'src/mqtt/mqtt.service';
import { QueryParamsDto } from 'src/dto/query-params.dto';
import { Device } from './entities/device.entity';

@ApiTags('devices activity')
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly mqttService: MqttService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get devices activity' })
  @ApiExtraModels(Device)
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
              items: { $ref: getSchemaPath(Device) },
            },
            currentPage: { type: 'number', example: 1 },
            totalCount: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  async getData(@Query() query: QueryParamsDto) {
    const data = await this.devicesService.getData(query);
    const totalCount = await this.devicesService.getTotalCount(query);
    return {
      items: data,
      currentPage: query.page,
      totalCount: totalCount,
    };
  }

  @Get('/latest')
  @ApiOperation({ summary: 'Get latest device activity' })
  @ApiExtraModels(Device)
  @ApiOkResponse({
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'object',
          $ref: getSchemaPath(Device),
        },
      },
    },
  })
  @ApiQuery({
    name: 'device',
    type: String,
  })
  async getLatest(@Query('device') device: string) {
    const data = await this.devicesService.getLatest(device);
    return data;
  }

  @Post()
  @ApiOperation({ summary: 'Change devices status' })
  @ApiExtraModels(Device)
  @ApiCreatedResponse({
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'object',
          $ref: getSchemaPath(Device),
        },
      },
    },
  })
  async addData(@Body() body: CreateDeviceDto): Promise<{}> {
    this.mqttService.publish('device_action', `${body.device}-${body.action}`);
    const newData = await this.devicesService.addData(body);
    return newData;
  }
}
