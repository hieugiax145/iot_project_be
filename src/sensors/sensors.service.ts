import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SensorsDataEntity } from '../entity/sensors.entity';
import { Repository } from 'typeorm';
import { AddSensorsDataDto } from '../dto/add-sensorsdata.dto';
import { QueryParamsDto } from '../dto/query-params.dto';

@Injectable()
export class SensorsService {

    constructor(
        @InjectRepository(SensorsDataEntity)
        private readonly sensorsDataRepository: Repository<SensorsDataEntity>,
    ) { }

    async getData(query: QueryParamsDto): Promise<SensorsDataEntity[]> {
        const { page, limit, order, startDate, endDate } = query;

        const queryBuilder = this.sensorsDataRepository.createQueryBuilder('sensorsdata');

        if (startDate) {
            queryBuilder.andWhere('sensorsdata.time >= :startDate', { startDate: new Date(startDate) });
        }

        if (endDate) {
            queryBuilder.andWhere('sensorsdata.time <= :endDate', { endDate: new Date(endDate) });
        }

        queryBuilder
            .orderBy('sensorsdata.time', order)
            .take(limit)
            .skip((page - 1) * limit);

        return await queryBuilder.getMany();
    }

    async getTotalCount(query: QueryParamsDto): Promise<number> {
        const { startDate, endDate } = query;

        const countQueryBuilder = this.sensorsDataRepository.createQueryBuilder('sensorsdata');

        if (startDate) {
            countQueryBuilder.andWhere('sensorsdata.time >= :startDate', { startDate: new Date(startDate) });
        } if (endDate) {
            countQueryBuilder.andWhere('sensorsdata.time <= :endDate', { endDate: new Date(endDate) });
        }

        return await countQueryBuilder.getCount();
    }

    async addData(data: AddSensorsDataDto): Promise<SensorsDataEntity> {
        const newData = this.sensorsDataRepository.create(data);
        return await this.sensorsDataRepository.save(newData);
    }

    async getLastest(): Promise<SensorsDataEntity> {
        const [data] = await this.sensorsDataRepository.find({
            order: { time: 'DESC' },
            take: 1
        });
        return data;
    }

}
