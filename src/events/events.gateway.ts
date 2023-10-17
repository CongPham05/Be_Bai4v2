import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatDTO } from './dto';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // constructor(private chatService: ChatService) { }
  @WebSocketServer()
  server: Server;

  private readonly users: Map<string, Socket> = new Map();

  // @SubscribeMessage('message')
  // async handleMessage(client: any, @MessageBody() data) {
  //   console.log(client)
  //   console.log(data)

  //   // await this.prismaService.message.create(payload);
  //   // this.server.emit('messageToClient', data)
  // }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, data: { roomId: string }) {
    client.join(data.roomId);
  }

  @SubscribeMessage('messageToRoom')
  async message(client: Socket, data: { roomId: string, dataMessage: any }) {
    console.log(data)
    this.server.to(data.roomId).emit('messageToClient', data);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.users.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.users.delete(client.id);
  }
}

// @SubscribeMessage('typing')
// async typing() {


