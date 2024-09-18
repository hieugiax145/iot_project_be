import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityDto } from 'src/dto/activity.dto';
import { QueryParamsDto } from 'src/dto/query-params.dto';
import { ActivityEntity } from 'src/entity/activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(ActivityEntity)
        private readonly activityEntityRepository: Repository<ActivityEntity>

    ) { }

    async getData(query: QueryParamsDto): Promise<ActivityEntity[]> {
        const { page, limit, order } = query;
        return await this.activityEntityRepository.find({
            order: { time: order },
            take: limit,
            skip: (page - 1) * limit
        });
    }

    async getTotalCount(query: QueryParamsDto): Promise<number> {
        const { startDate, endDate } = query;
    
        const countQueryBuilder = this.activityEntityRepository.createQueryBuilder('action');
    
        if (startDate) {
          countQueryBuilder.andWhere('sensors.time >= :startDate', { startDate });
        }if (endDate) {
          countQueryBuilder.andWhere('sensors.time <= :endDate', { endDate });
        }
    
        return await countQueryBuilder.getCount();
      }

    async addData(data: ActivityDto) {
        const newData = this.activityEntityRepository.create(data);
        return await this.activityEntityRepository.save(newData);
    }

}
