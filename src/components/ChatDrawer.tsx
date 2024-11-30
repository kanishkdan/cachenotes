import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, AlertCircle, Plus, Copy, Check, Clock, MessageSquarePlus } from 'lucide-react';
import { Message } from '../types/Message';
import { ChatList } from './ChatDrawer/ChatList';
import { formatDate } from '../utils/dateUtils';
import { useChatStore } from '../store/useChatStore';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  input: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAddToNote: (content: string) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export function ChatDrawer({
  isOpen,
  onClose,
  noteId,
  input,
  isLoading,
  error,
  onInputChange,
  onSubmit,
  onAddToNote,
  inputRef: externalInputRef,
}: ChatDrawerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(false);

  const {
    getChats,
    getActiveChat,
    createChat,
    setActiveChat,
    deleteChat
  } = useChatStore();

  const chats = getChats(noteId).filter(chat => chat.messages.length > 0);
  const activeChat = getActiveChat(noteId);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleNewChat = () => {
    createChat(noteId);
    setShowChatList(false);
  };

  const handleCopyText = async (messageId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl flex flex-col z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Chat with Claude</h2>
          <button
            onClick={handleNewChat}
            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-50"
            title="New Chat"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChatList(!showChatList)}
            className={`p-2 rounded-lg transition-colors ${
              showChatList 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title="Chat History"
          >
            <Clock className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showChatList && chats.length > 0 && (
        <ChatList
          chats={chats}
          activeChat={activeChat?.id || ''}
          onSelectChat={(chatId) => {
            setActiveChat(noteId, chatId);
            setShowChatList(false);
          }}
          onDeleteChat={(chatId) => deleteChat(noteId, chatId)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChat?.messages.map((message) => (
          <div
            key={message.id}
            className={`group relative flex flex-col gap-1 ${
              message.role === 'assistant'
                ? 'items-start'
                : 'items-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === 'assistant'
                  ? 'bg-gray-100 rounded-tl-none group-hover:bg-gray-200 transition-colors'
                  : 'bg-indigo-600 text-white rounded-tr-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(message.timestamp)}
            </span>
            {message.role === 'assistant' && (
              <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onAddToNote(message.content)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                  title="Add to Note"
                >
                  <Plus className="w-4 h-4" />
                  <span className="sr-only">Add to Note</span>
                </button>
                <button
                  onClick={() => handleCopyText(message.id, message.content)}
                  className={`p-1.5 transition-colors rounded-md hover:bg-gray-50 ${
                    copiedMessageId === message.id
                      ? 'text-green-500'
                      : 'text-gray-400 hover:text-indigo-600'
                  }`}
                  title={copiedMessageId === message.id ? 'Copied!' : 'Copy'}
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="sr-only">
                    {copiedMessageId === message.id ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Claude is thinking...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onSubmit} className="p-4 border-t border-gray-200">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Message Claude..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[42px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          rows={1}
        />
      </form>
    </div>
  );
}