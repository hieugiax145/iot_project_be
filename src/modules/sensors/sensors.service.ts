import { Injectable } from '@nestjs/common';
import { Sensor } from './entities/sensor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { QueryParamsDto } from 'src/dto/query-params.dto';
import { CreateSensorDto } from './dto/create-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorsDataRepository: Repository<Sensor>,
  ) {}

  async getData(query: QueryParamsDto): Promise<Sensor[]> {
    const { page, limit, order, startDate, endDate, keyword } = query;

    const queryBuilder =
      this.sensorsDataRepository.createQueryBuilder('sensorsdata');

    if (startDate) {
      queryBuilder.andWhere('sensorsdata.time >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('sensorsdata.time <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (keyword) {
      const decodedKeyword = decodeURIComponent(keyword.trim());

      console.log(`Decoded keyword: ${decodedKeyword}`);
      // const dateKeyword = new Date(decodedKeyword);
      // const isDateValid = !isNaN(dateKeyword.getTime());
      const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(
        decodedKeyword.substring(0, 10),
      );
      console.log(isDateValid);

      const numericKeyword = parseFloat(keyword);
      const isNumberValid = !isNaN(numericKeyword);

      const epsilon = 0.01;

      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (isDateValid) {
            qb.orWhere('sensorsdata.time = :exactTime', {
              exactTime: `${decodedKeyword}`,
            });
          }
          if (isNumberValid) {
            qb.orWhere('(sensorsdata.temp BETWEEN :minValue AND :maxValue)', {
              minValue: numericKeyword - epsilon,
              maxValue: numericKeyword + epsilon,
            })
              .orWhere('(sensorsdata.hum BETWEEN :minValue AND :maxValue)', {
                minValue: numericKeyword - epsilon,
                maxValue: numericKeyword + epsilon,
              })
              .orWhere('(sensorsdata.light BETWEEN :minValue AND :maxValue)', {
                minValue: numericKeyword - epsilon,
                maxValue: numericKeyword + epsilon,
              });
          }
        }),
      );
    }

    queryBuilder
      .orderBy('sensorsdata.time', order)
      .take(limit)
      .skip((page - 1) * limit);

    return await queryBuilder.getMany();
  }

  async getTotalCount(query: QueryParamsDto): Promise<number> {
    const { startDate, endDate, keyword } = query;

    const countQueryBuilder =
      this.sensorsDataRepository.createQueryBuilder('sensorsdata');

    if (startDate) {
      countQueryBuilder.andWhere('sensorsdata.time >= :startDate', {
        startDate: new Date(startDate),
      });
    }
    if (endDate) {
      countQueryBuilder.andWhere('sensorsdata.time <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (keyword) {
      const decodedKeyword = decodeURIComponent(keyword.trim());

      const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(
        decodedKeyword.substring(0, 10),
      );

      const numericKeyword = parseFloat(decodedKeyword);
      const isNumberValid = !isNaN(numericKeyword);

      const epsilon = 0.01;

      countQueryBuilder.andWhere(
        new Brackets((qb) => {
          if (isDateValid) {
            qb.orWhere('sensorsdata.time = :exactTime', {
              exactTime: `${decodedKeyword}`,
            });
          }
          if (isNumberValid) {
            qb.orWhere('(sensorsdata.temp BETWEEN :minValue AND :maxValue)', {
              minValue: numericKeyword - epsilon,
              maxValue: numericKeyword + epsilon,
            })
              .orWhere('(sensorsdata.hum BETWEEN :minValue AND :maxValue)', {
                minValue: numericKeyword - epsilon,
                maxValue: numericKeyword + epsilon,
              })
              .orWhere('(sensorsdata.light BETWEEN :minValue AND :maxValue)', {
                minValue: numericKeyword - epsilon,
                maxValue: numericKeyword + epsilon,
              });
          }
        }),
      );
    }

    return await countQueryBuilder.getCount();
  }

  async addData(data: CreateSensorDto): Promise<Sensor> {
    const newData = this.sensorsDataRepository.create(data);
    return await this.sensorsDataRepository.save(newData);
  }

  async getLastest(): Promise<Sensor> {
    const [data] = await this.sensorsDataRepository.find({
      order: { time: 'DESC' },
      take: 1,
    });
    return data;
  }

  async countLightGreaterThan800(): Promise<number> {
    const count = await this.sensorsDataRepository
      .createQueryBuilder('sensorsdata')
      .where('sensorsdata.dust > :dustValue', { dustValue: 800 })
      .getCount();

    return count;
  }

  convertUtcToCustomFormat(utcDate: string): string {
    const date = new Date(utcDate);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds())
      .padStart(3, '0')
      .padEnd(6, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}
