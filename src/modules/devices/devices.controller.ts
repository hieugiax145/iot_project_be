import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MqttService } from 'src/mqtt/mqtt.service';
import { QueryParamsDto } from 'src/dto/query-params.dto';

@ApiTags('devices activity')
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly mqttService: MqttService,
  ) {}

  @Get()
    @ApiQuery({
      name: 'endDate',
      type: String,
      description: 'End date for filtering (YYYY-MM-DD)',
      required: false,
    })
    @ApiQuery({
      name: 'startDate',
      type: String,
      description: 'Start date for filtering (YYYY-MM-DD)',
      required: false,
    })
    @ApiQuery({
      name: 'order',
      enum: ['ASC', 'DESC'],
      description: 'Order direction for sorting',
      required: false,
    })
    @ApiQuery({
      name: 'limit',
      type: Number,
      description: 'Number of items per page',
      required: false,
    })
    @ApiQuery({
      name: 'page',
      type: Number,
      description: 'Page number for pagination',
      required: false,
    })
    @ApiQuery({
      name: 'keyword',
      type: String,
      description: 'Search key',
      required: false,
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
    @ApiQuery({
      name: 'device',
      type: String,
    })
    async getLatest(@Query('device') device: string) {
      const data = await this.devicesService.getLatest(device);
      return data;
    }
  
    @Post()
    @ApiBody({
      description: 'Add new action to control LED',
      type: CreateDeviceDto,
      examples: {
        example: {
          value: { device: 'led1', action: 1 },
        },
      },
    })
    async addData(
      @Body() body: CreateDeviceDto,
    ): Promise<{}> {
      this.mqttService.publish('device_action', `${body.device}-${body.action}`);
      const newData = await this.devicesService.addData(body);
      return newData;
    }
}
