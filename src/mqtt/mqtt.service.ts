import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { Gateway } from 'src/gateway/gateway';
import { SensorsService } from 'src/modules/sensors/sensors.service';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqtt: MqttClient;

  constructor(
    private readonly sensorsDataService: SensorsService,
    private readonly socketService: Gateway,
  ) {}
  onModuleInit() {
    this.connect();
  }

  connect() {
    const mqtt_broker_url = 'mqtt://localhost:1883';
    this.mqtt = connect(mqtt_broker_url, {
      username: 'hieugia',
      password: '123',
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
