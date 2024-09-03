import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { SensorsGateway } from 'src/sensors/sensors.gateway';
import { SensorsService } from 'src/sensors/sensors.service';

@Injectable()
export class MqttService implements OnModuleInit {
    private mqtt: MqttClient;

    constructor(
        private readonly sensorsDataService: SensorsService,
        private readonly socketService: SensorsGateway
    ) { }
    onModuleInit() {
        this.connect()
    }

    connect() {
        const mqtt_broker_url = 'mqtt://localhost:1883';
        this.mqtt = connect(mqtt_broker_url);

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
                const data= await this.sensorsDataService.addData(JSON.parse(message.toString()));
                this.socketService.server.emit('latestData',data)
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
        })
    }
}
