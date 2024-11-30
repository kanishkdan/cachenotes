import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { Chat } from '../../types/Chat';
import { formatDate } from '../../utils/dateUtils';

interface ChatListProps {
  chats: Chat[];
  activeChat: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatList({ chats, activeChat, onSelectChat, onDeleteChat }: ChatListProps) {
  const getChatTitle = (chat: Chat) => {
    const firstUserMessage = chat.messages.find(msg => msg.role === 'user');
    if (!firstUserMessage) return 'Empty Chat';
    
    const title = firstUserMessage.content;
    return title.length > 40 ? title.substring(0, 40) + '...' : title;
  };

  return (
    <div className="border-b border-gray-200 max-h-[50vh] overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${
            chat.id === activeChat ? 'bg-indigo-50' : ''
          }`}
          onClick={() => onSelectChat(chat.id)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {getChatTitle(chat)}
              </h3>
              <p className="text-xs text-gray-500">{formatDate(chat.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChat(chat.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 ml-2 flex-shrink-0"
            title="Delete chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}