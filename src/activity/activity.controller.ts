import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ActivityDto } from 'src/dto/activity.dto';
import { ActivityService } from './activity.service';
import { MqttService } from 'src/mqtt/mqtt.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { QueryParamsDto } from 'src/dto/query-params.dto';

@ApiTags('devices activity')
@Controller('activity')
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService,
        private readonly mqttService: MqttService
    ) { }

    @Get()
    @ApiQuery({ name: 'page', type: Number, description: 'Page number for pagination', required: false })
    @ApiQuery({ name: 'limit', type: Number, description: 'Number of items per page', required: false })
    @ApiQuery({ name: 'order', enum: ['ASC', 'DESC'], description: 'Order direction for sorting', required: false })
    @ApiQuery({ name: 'startDate', type: String, description: 'Start date for filtering (YYYY-MM-DD)', required: false })
    @ApiQuery({ name: 'endDate', type: String, description: 'End date for filtering (YYYY-MM-DD)', required: false })
    async getData(@Query() query: QueryParamsDto) {
        const data = await this.activityService.getData(query);
        const totalCount=await this.activityService.getTotalCount(query);
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: data,
            currentPage: query.page,
            totalCount: totalCount,
        };
    }

    @Post()
    async addData(@Body() body: ActivityDto): Promise<{ statusCode: number; message: string; data: ActivityDto }> {
        this.mqttService.publish('device_action', body.action === 1 ? '1' : '0');
        const newData = await this.activityService.addData(body);
        return {
            statusCode: 201,
            message: "Success",
            data: newData
        }
    }
}
