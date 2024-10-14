import {Injectable} from '@angular/core';
import {Client, Message} from '@stomp/stompjs';
import {ChatMessage} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class chatService {
  client: Client;

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
      content: content,
      sender: sender,
      type: 'CHAT',
      createdAt: new Date(),
      replyToMessageId: null
    };
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage)
    });
  }

  addUser(username: string) {
    const chatMessage = { sender: username, type: 'JOIN' };
    try {
      this.client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify(chatMessage)
      });
    } catch (error) {
      console.error('Error publishing JOIN message:', error);
    }
  }

  leaveUser(username: string) {
    const chatMessage = {sender: username, type: 'LEAVE'};
    this.client.publish({
      destination: '/app/chat.leaveUser',
      body: JSON.stringify(chatMessage)
    });
  }
}
