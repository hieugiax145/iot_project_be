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
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'user_db',
    // entities: [SensorsDataEntity],
    autoLoadEntities: true,
    synchronize: true
  }),SensorsModule, ActivityModule, MqttModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
