import {Injectable} from '@angular/core';
import {Client, Message} from '@stomp/stompjs';
import {ChatMessage} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Client;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws'),
    });
  }

  connect(onMessage: (message: ChatMessage) => void) {
    this.client.onConnect = () => {
      this.client.subscribe('/topic/public', (message: Message) => {
        onMessage(JSON.parse(message.body));
      });
    };

    this.client.onStompError = (error) => {
      console.error('Broker reported error: ' + error.headers['message']);
      console.error('Additional details: ' + error.body);
    };

    this.client.activate();
  }

  sendMessage(content: string, sender: string) {
    const chatMessage = {
      id: 0,
      content,
      sender,
      type: 'CHAT',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'SENT',
      reactions: {},
      replyToMessageId: null,
      isEdited: false
    };
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage)
    });
  }

  replyToMessage(content: string, sender: string, replyToMessageId: number) {
    const chatMessage = {
      id: 0,
      content,
      sender,
      type: 'CHAT',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'SENT',
      reactions: {},
      replyToMessageId,
      isEdited: false
    };
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage)
    });
  }

  addUser(username: string) {
    const chatMessage = { sender: username, type: 'JOIN' };
    this.client.publish({
      destination: '/app/chat.addUser',
      body: JSON.stringify(chatMessage)
    });
  }

  leaveUser(username: string) {
    const chatMessage = {sender: username, type: 'LEAVE'};
    this.client.publish({
      destination: '/app/chat.leaveUser',
      body: JSON.stringify(chatMessage)
    });
  }
}
