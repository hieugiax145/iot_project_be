import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { QueryParamsDto } from 'src/dto/query-params.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly activityEntityRepository: Repository<Device>,
  ) {}
  async getData(query: QueryParamsDto): Promise<Device[]> {
    const { page, limit, order, startDate, endDate, keyword } = query;

    const queryBuilder =
      this.activityEntityRepository.createQueryBuilder('activity');

    if (startDate) {
      queryBuilder.andWhere('activity.time >= :startDate', {
        startDate: new Date(startDate),
      });
    }
    if (endDate) {
      queryBuilder.andWhere('activity.time <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (keyword) {
      // Decode the keyword and trim whitespace
      const decodedKeyword = decodeURIComponent(keyword.trim());

      // Log the decoded keyword for debugging
      console.log(`Decoded keyword: ${decodedKeyword}`);

      const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(
        decodedKeyword.substring(0, 10),
      );

      const numericKeyword = parseInt(decodedKeyword);
      const isNumberValid = !isNaN(numericKeyword);

      queryBuilder.andWhere(
        new Brackets((qb) => {
          // if(keyword.length>10){
          qb.orWhere('activity.device LIKE :keyword', {
            keyword: `%${decodedKeyword}%`,
          });
          // }
          if (isNumberValid) {
            qb.orWhere('activity.action = :keywordNumber', {
              keywordNumber: numericKeyword,
            });
          }

          if (isDateValid) {
            // Check for equality with the decoded date
            qb.orWhere('activity.time = :exactTime', {
              exactTime: `${decodedKeyword}`,
            });
          }
        }),
      );
    }

    queryBuilder
      .orderBy('activity.time', order)
      .take(limit)
      .skip((page - 1) * limit);

    return await queryBuilder.getMany();
  }

  async getTotalCount(query: QueryParamsDto): Promise<number> {
    const { startDate, endDate, keyword } = query;

    const countQueryBuilder =
      this.activityEntityRepository.createQueryBuilder('activity');

    if (startDate) {
      countQueryBuilder.andWhere('activity.time >= :startDate', {
        startDate: new Date(startDate),
      });
    }
    if (endDate) {
      countQueryBuilder.andWhere('activity.time <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (keyword) {
      // Decode the keyword and trim whitespace
      const decodedKeyword = decodeURIComponent(keyword.trim());

      // Log the decoded keyword for debugging
      console.log(`Decoded keyword: ${decodedKeyword}`);

      const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(
        decodedKeyword.substring(0, 10),
      );

      const numericKeyword = parseInt(decodedKeyword);
      const isNumberValid = !isNaN(numericKeyword);

      countQueryBuilder.andWhere(
        new Brackets((qb) => {
          // if(keyword.length>10){
          qb.orWhere('activity.device LIKE :keyword', {
            keyword: `%${decodedKeyword}%`,
          });
          // }
          if (isNumberValid) {
            qb.orWhere('activity.action = :keywordNumber', {
              keywordNumber: numericKeyword,
            });
          }

          if (isDateValid) {
            // Check for equality with the decoded date
            qb.orWhere('activity.time = :exactTime', {
              exactTime: `${decodedKeyword}`,
            });
          }
        }),
      );
    }

    return await countQueryBuilder.getCount();
  }

  async addData(data: CreateDeviceDto) {
    const newData = this.activityEntityRepository.create(data);
    return await this.activityEntityRepository.save(newData);
  }

  async getLatest(device: string): Promise<Device> {
    const [data] = await this.activityEntityRepository.find({
      where: { device },
      order: { time: 'DESC' },
      take: 1,
    });
    return data ?? new Device();
  }
}
