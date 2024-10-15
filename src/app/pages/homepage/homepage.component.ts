import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {chatService} from '../../services/websocket.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChatMessage} from '../../models/message.model';
import {Message} from '@stomp/stompjs';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    DatePipe,
    NgIf,
    HttpClientModule
  ],
  providers: [chatService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  @ViewChild('messageList') messageList!: ElementRef;

  messages: ChatMessage[] = [];
  messageContent = '';
  username = 'User' + Math.floor(Math.random() * 1000);

  constructor(
    private chatService: chatService,
    private cdr: ChangeDetectorRef
  ) {
  }

  private scrollToBottom() {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    } catch (err) {
      console.error("Scroll to bottom failed: ", err);
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.chatService.getMessages().subscribe((messages: ChatMessage[]) => {
        this.messages = messages.map(message => ({
          ...message,
          createdAt: new Date(message.createdAt)
        }));
        this.messages.forEach(message => {
          message.createdAt = new Date(message.createdAt);
        });
      });
      this.scrollToBottom();
    }, 1000);
    this.chatService.connect((message: ChatMessage) => {
      message.createdAt = new Date(message.createdAt);
      if (message.type === 'JOIN') {
        message.content = `${message.sender} has joined the chat.`;
      }
      this.messages = [...this.messages, message];
      this.scrollToBottom();
      this.cdr.detectChanges();
    });

    this.chatService.client.onConnect = () => {
      this.chatService.client.subscribe('/user/queue/messages', (message: Message) => {
        const messages: ChatMessage[] = JSON.parse(message.body);
        this.messages = [...messages, ...this.messages];
        this.scrollToBottom();
      });
      this.chatService.addUser(this.username);
    };
    this.chatService.client.activate();
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      const newMessage: ChatMessage = {
        id: this.messages.length + 1,
        content: this.messageContent,
        sender: this.username,
        type: 'CHAT',
        createdAt: new Date(),
        replyToMessageId: 0
      };
      this.messages = [...this.messages, newMessage];
      this.cdr.detectChanges();
      this.chatService.sendMessage(this.messageContent, this.username);
      this.messageContent = '';
      this.scrollToBottom();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleTabClose() {
    this.chatService.leaveUser(this.username);
  }

  trackById(index: number, message: ChatMessage) {
    return message.id;
  }
}
