import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import {ChatMessage} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Client;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws'),
      debug: (str) => { console.log(new Date(), str); }
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
    const chatMessage = { content, sender, type: 'CHAT' };
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
}
