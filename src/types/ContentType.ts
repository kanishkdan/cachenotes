export type ContentType = 'note' | 'twitter-thread';

export interface Media {
  id: string;
  type: 'image' | 'video';
}

export interface TwitterPost {
  id: string;
  content: string;
  createdAt: Date;
  media?: Media[];
}

export interface ThreadContent {
  posts: TwitterPost[];
}