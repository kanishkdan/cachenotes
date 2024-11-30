import { Message } from './Message';

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export interface ChatContext {
  noteContent?: string;
  threadContent?: {
    posts: {
      content: string;
    }[];
  };
  contentType: 'note' | 'twitter-thread';
}