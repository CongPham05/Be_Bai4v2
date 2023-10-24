import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private activeUsers = [];
  @WebSocketServer()
  server: Server;


  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers = this.activeUsers.filter((user) => user.socketId !== client.id);
    this.server.emit("get-users", this.activeUsers);
  }

  @SubscribeMessage('new-user-add')
  async addUser(client: Socket, newUserId: number) {
    if (!this.activeUsers.some((user) => user.userId === newUserId)) {
      this.activeUsers.push(
        {
          userId: newUserId,
          socketId: client.id
        }
      );
    }
    this.server.emit("get-users", this.activeUsers);
  }

  @SubscribeMessage('send-message')
  async message(client: Socket, data: { receiverId: number }) {
    if (data && data.receiverId !== null) {
      const { receiverId } = data;
      const user = this.activeUsers.find((user) => user.userId === receiverId);
      if (user) {
        this.server.to(user.socketId).emit("recieve-message", data);
      }
    }
    //  else {
    //   console.error("Invalid data: 'receiverId' is null.");
    // }
  }
}



