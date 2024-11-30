import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat } from '../types/Chat';
import { Message } from '../types/Message';
import { generateUniqueId } from '../utils/noteUtils';

interface ChatState {
  chats: Record<string, Chat[]>;
  activeChat: Record<string, string>;
  createChat: (noteId: string) => string;
  addMessage: (noteId: string, chatId: string, message: Message) => void;
  getChats: (noteId: string) => Chat[];
  getActiveChat: (noteId: string) => Chat | undefined;
  setActiveChat: (noteId: string, chatId: string) => void;
  deleteChat: (noteId: string, chatId: string) => void;
  updateChatTitle: (noteId: string, chatId: string, title: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: {},
      activeChat: {},

      createChat: (noteId: string) => {
        const chatId = generateUniqueId();
        const newChat: Chat = {
          id: chatId,
          title: `Chat ${new Date().toLocaleString()}`,
          createdAt: new Date(),
          messages: []
        };

        set((state) => ({
          chats: {
            ...state.chats,
            [noteId]: [...(state.chats[noteId] || []), newChat]
          },
          activeChat: {
            ...state.activeChat,
            [noteId]: chatId
          }
        }));

        return chatId;
      },

      addMessage: (noteId: string, chatId: string, message: Message) =>
        set((state) => {
          const noteChats = state.chats[noteId] || [];
          const chatIndex = noteChats.findIndex(chat => chat.id === chatId);
          
          if (chatIndex === -1) return state;

          const updatedChats = [...noteChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            messages: [...updatedChats[chatIndex].messages, message]
          };

          return {
            chats: {
              ...state.chats,
              [noteId]: updatedChats
            }
          };
        }),

      getChats: (noteId: string) => {
        const state = get();
        return state.chats[noteId] || [];
      },

      getActiveChat: (noteId: string) => {
        const state = get();
        const activeChatId = state.activeChat[noteId];
        if (!activeChatId) return undefined;
        
        const noteChats = state.chats[noteId] || [];
        return noteChats.find(chat => chat.id === activeChatId);
      },

      setActiveChat: (noteId: string, chatId: string) =>
        set((state) => ({
          activeChat: {
            ...state.activeChat,
            [noteId]: chatId
          }
        })),

      deleteChat: (noteId: string, chatId: string) =>
        set((state) => {
          const noteChats = state.chats[noteId] || [];
          const updatedChats = noteChats.filter(chat => chat.id !== chatId);
          
          const newState: Partial<ChatState> = {
            chats: {
              ...state.chats,
              [noteId]: updatedChats
            },
            activeChat: { ...state.activeChat }
          };

          // If we're deleting the active chat, set a new active chat or remove the entry
          if (state.activeChat[noteId] === chatId) {
            if (updatedChats.length > 0) {
              newState.activeChat![noteId] = updatedChats[0].id;
            } else {
              delete newState.activeChat![noteId];
            }
          }

          return newState as ChatState;
        }),

      updateChatTitle: (noteId: string, chatId: string, title: string) =>
        set((state) => {
          const noteChats = state.chats[noteId] || [];
          const chatIndex = noteChats.findIndex(chat => chat.id === chatId);
          
          if (chatIndex === -1) return state;

          const updatedChats = [...noteChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            title
          };

          return {
            chats: {
              ...state.chats,
              [noteId]: updatedChats
            }
          };
        })
    }),
    {
      name: 'chat-storage',
      version: 1
    }
  )
);