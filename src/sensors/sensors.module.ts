import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsDataEntity } from '../entity/sensors.entity';
import { SensorsGateway } from './sensors.gateway';

@Module({
  imports:[TypeOrmModule.forFeature([SensorsDataEntity])],
  controllers: [SensorsController],
  providers: [SensorsService, SensorsGateway],
  exports:[SensorsService,TypeOrmModule.forFeature([SensorsDataEntity]),SensorsGateway]
})
export class SensorsModule {}
