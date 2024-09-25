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
    const { page, limit, order, startDate, endDate } = query;

    const queryBuilder = this.activityEntityRepository.createQueryBuilder('activity');

    if (startDate) {
      queryBuilder.andWhere('activity.time >= :startDate', { startDate: new Date(startDate) });
    } if (endDate) {
      queryBuilder.andWhere('activity.time <= :endDate', { endDate: new Date(endDate) });
    }

    queryBuilder.orderBy('activity.time', order).take(limit).skip((page - 1) * limit)

    return await queryBuilder.getMany();

    // return await this.activityEntityRepository.find({
    //   order: { time: order },
    //   take: limit,
    //   skip: (page - 1) * limit
    // });
  }

  async getTotalCount(query: QueryParamsDto): Promise<number> {
    const { startDate, endDate } = query;

    const countQueryBuilder = this.activityEntityRepository.createQueryBuilder('activity');

    if (startDate) {
      countQueryBuilder.andWhere('activity.time >= :startDate', { startDate: new Date(startDate) });
    } if (endDate) {
      countQueryBuilder.andWhere('activity.time <= :endDate', { endDate: new Date(endDate) });
    }

    return await countQueryBuilder.getCount();
  }

  async addData(data: ActivityDto) {
    const newData = this.activityEntityRepository.create(data);
    return await this.activityEntityRepository.save(newData);
  }

}
