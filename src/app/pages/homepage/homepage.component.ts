import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '../../services/websocket.service';
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
export class HomepageComponent implements OnInit, OnDestroy {
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

  ngOnDestroy() {
    this.chatService.leaveUser(this.username);
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
