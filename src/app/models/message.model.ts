export type MessageType =
  'CHAT' |
  'JOIN' |
  'LEAVE';

export interface IChatMessage {
  id: number;
  content: string;
  sender: string;
  type: MessageType;
  createdAt: Date;
  replyToMessageId: number;
}
