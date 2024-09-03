import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from 'src/entity/activity.entity';
import { MqttService } from 'src/mqtt/mqtt.service';
import { SensorsModule } from 'src/sensors/sensors.module';

@Module({
  imports:[TypeOrmModule.forFeature([ActivityEntity]),SensorsModule],
  controllers: [ActivityController],
  providers: [ActivityService,MqttService]
})
export class ActivityModule {}
