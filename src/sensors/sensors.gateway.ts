import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class SensorsGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor() { }
  onModuleInit() {
    this.server.on('connection', (socket) => {

    })
  }
  handleConnection(client: any, ...args: any[]) {
    console.log("new user connected... " + client.id)
  }

  handleDisconnect(client: any) {
    console.log("user disconnected... " + client.id)
  }
  @SubscribeMessage('mm')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', body)
  }

  @SubscribeMessage('getLatestData')
  async handleGetLatestData(@MessageBody() data: any) {
    // const latestData = await this.sensorsService.getLastest();
    this.server.emit('latestData', data);
  }

}
