import {Injectable} from '@angular/core';
import {Client, Message} from '@stomp/stompjs';
import {IChatMessage} from '../models/message.model';
import {HttpClient} from '@angular/common/http';
import {environments} from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class chatService {
  client: Client;

  constructor(private http: HttpClient) {
    this.client = new Client({
      webSocketFactory: () => new WebSocket(`${environments.BACKEND_WS_URL}`),
    });
  }

  connect(onMessage: (message: IChatMessage) => void) {
    this.client.onConnect = () => {
      this.client.subscribe('/queue/messages', (message: Message) => {
        const allMessages = JSON.parse(message.body);
        onMessage(allMessages);
      });
      this.client.subscribe(`${environments.WS.public}`, (message: Message) => {
        const receivedMessage = JSON.parse(message.body);
        onMessage(receivedMessage);
      });
    };
    this.client.activate();
  }

  getMessages() {
    this.client.publish({
      destination: `${environments.WS.getMessages}`,
      body: ''
    })
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
      destination: `${environments.WS.chatSendMessage}`,
      body: JSON.stringify(chatMessage)
    });
  }

  addUser(username: string) {
    const chatMessage = { sender: username, type: 'JOIN' };
    try {
      this.client.publish({
        destination: `${environments.WS.chatAddUser}`,
        body: JSON.stringify(chatMessage)
      });
    } catch (error) {
      console.error('Error publishing JOIN message:', error);
    }
  }

  leaveUser(username: string) {
    const chatMessage = {sender: username, type: 'LEAVE'};
    this.client.publish({
      destination: `${environments.WS.leaveUser}`,
      body: JSON.stringify(chatMessage)
    });
  }
}
