export type MessageType =
  'CHAT' |
  'JOIN' |
  'LEAVE';

export interface ChatMessage {
  id: number;
  content: string;
  sender: string;
  type: MessageType;
  createdAt: Date;
  replyToMessageId: number;
}
