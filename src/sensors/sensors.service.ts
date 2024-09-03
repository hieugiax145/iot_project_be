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

    async getAll(query:QueryParamsDto): Promise<SensorsDataEntity[]> {
        const {page,limit,order}=query;
        return await this.sensorsDataRepository.find({
            order:{time:order},
            take:limit,
            skip:(page-1)*limit
        });
        
    }

    async addData(data:AddSensorsDataDto): Promise<SensorsDataEntity> {
        const newData = this.sensorsDataRepository.create(data);
        return await this.sensorsDataRepository.save(newData);
    }

    async getLastest():Promise<SensorsDataEntity>{
        const [data]= await this.sensorsDataRepository.find({
            order:{time:'DESC'},
            take:1
        });
        return data;
    }

}
