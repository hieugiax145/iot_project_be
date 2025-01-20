import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto, CreateDeviceDtoResponse } from './dto/create-device.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({summary:'Get devices activity'})
  @ApiResponse({type:CreateDeviceDtoResponse<CreateDeviceDto>})
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
  @ApiOperation({summary:'Get latest device activity'})
  @ApiQuery({
    name: 'device',
    type: String,
  })
  async getLatest(@Query('device') device: string) {
    const data = await this.devicesService.getLatest(device);
    return data;
  }

  @Post()
  @ApiOperation({summary:'Change devices status'})
  @ApiBody({
    description: 'Add new action to control LED',
    type: CreateDeviceDto,
    examples: {
      example: {
        value: { device: 'led1', action: 1 },
      },
    },
  })
  async addData(@Body() body: CreateDeviceDto): Promise<{}> {
    this.mqttService.publish('device_action', `${body.device}-${body.action}`);
    const newData = await this.devicesService.addData(body);
    return newData;
  }
}
