import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MqttClient, connect } from 'mqtt';
import { Gateway } from 'src/gateway/gateway';
import { SensorsService } from 'src/modules/sensors/sensors.service';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqtt: MqttClient;

  constructor(
    private readonly sensorsDataService: SensorsService,
    private readonly socketService: Gateway,
    private readonly configService: ConfigService,
  ) {}
  onModuleInit() {
    this.connect();
  }

  connect() {
    const mqtt_broker_url = this.configService.get<string>('MQTT_BROKER_URL');
    this.mqtt = connect(mqtt_broker_url, {
      // port:+this.configService.get<string>('MQTT_PORT'),
      username: this.configService.get<string>('MQTT_USERNAME'),
      password: this.configService.get<string>('MQTT_PASSWORD'),
    });

    this.mqtt.on('connect', () => {
      console.log('Connected to MQTT server');
      this.mqtt.subscribe('sensorsdata', (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        }
      });
    });

    this.mqtt.on('message', async (topic, message) => {
      console.log('New message received!');
      console.log(message.toString());
      try {
        const data = await this.sensorsDataService.addData(
          JSON.parse(message.toString()),
        );
        // console.log(decodeURIComponent("2024-10-09%2023%3A03%3A20.771000".trim()))
        console.log(new Date(new Date().getTime() + 7 * 60 * 60 * 1000));
        this.socketService.server.emit('latestData', data);
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });
  }

  publish(topic: string, message: string) {
    this.mqtt.publish(topic, message, {}, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log(`Published message: ${message} to topic: ${topic}`);
      }
    });
  }
}
