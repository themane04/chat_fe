import {Component, HostListener, OnInit} from '@angular/core';
import {chatService} from '../../services/websocket.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChatMessage} from '../../models/message.model';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    DatePipe,
    NgIf
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  messages: ChatMessage[] = [];
  messageContent = '';
  username = 'User' + Math.floor(Math.random() * 1000);

  constructor(private chatService: chatService) {
  }

  ngOnInit() {
    this.chatService.connect((message: ChatMessage) => {
      message.createdAt = new Date(message.createdAt);
      if (message.type === 'JOIN') {
        message.content = `${message.sender} has joined the chat.`;
      }
      this.messages.push(message);
    });

    this.chatService.client.onConnect = () => {
      this.chatService.addUser(this.username);
    };
    this.chatService.client.activate();
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      this.chatService.sendMessage(this.messageContent, this.username);
      this.messageContent = '';
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleTabClose() {
    this.chatService.leaveUser(this.username);
  }

  trackById(id: number) {
    return id;
  }
}
