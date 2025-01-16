import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { SensorsModule } from '../sensors/sensors.module';
import { MqttService } from 'src/mqtt/mqtt.service';
import { Gateway } from 'src/gateway/gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), SensorsModule],
  controllers: [DevicesController],
  providers: [DevicesService, MqttService, Gateway],
})
export class DevicesModule {}
