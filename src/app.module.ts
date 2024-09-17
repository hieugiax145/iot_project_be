import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorsModule } from './sensors/sensors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsDataEntity } from './entity/sensors.entity';
import { MqttService } from './mqtt/mqtt.service';
import { SensorsService } from './sensors/sensors.service';
import { ActivityModule } from './activity/activity.module';
import { MqttModule } from './mqtt/mqtt.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'hieugia.crq46mkoo53k.ap-southeast-1.rds.amazonaws.com',
    port: 3306,
    username: 'admin',
    password: '12345678',
    database: 'iot',
    // entities: [SensorsDataEntity],
    autoLoadEntities: true,
    synchronize: true
  }),SensorsModule, ActivityModule, MqttModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
