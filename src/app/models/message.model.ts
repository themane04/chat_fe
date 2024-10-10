type MessageType =
  'CHAT' |
  'JOIN' |
  'LEAVE';

type MessageStatus =
  'SENT' |
  'DELIVERED' |
  'READ';

export interface ChatMessage {
  id: number;
  content: string;
  sender: string;
  type: MessageType;
  createdAt: Date;
  updatedAt: Date;
  status: MessageStatus;
  reactions: Record<string, number>;
  replyToMessageId: number;
  isEdited: boolean;
}
