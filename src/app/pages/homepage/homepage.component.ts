import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/websocket.service';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChatMessage} from '../../models/message.model';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  messages: ChatMessage[] = [];
  messageContent = '';
  username = 'User' + Math.floor(Math.random() * 1000);

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.connect((message: ChatMessage) => {
      this.messages.push(message);
    });

    this.chatService.addUser(this.username);
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      this.chatService.sendMessage(this.messageContent, this.username);
      this.messageContent = '';
    }
  }
}
