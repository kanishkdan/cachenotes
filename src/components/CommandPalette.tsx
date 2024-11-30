import React, { useState, useEffect, useRef } from 'react';
import { Command, Loader2, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { askClaude } from '../utils/claude';
import { ApiError } from '../utils/apiUtils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CommandPaletteProps {
  selectedText?: string;
}

export function CommandPalette({ selectedText = '' }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(selectedText);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const { claudeApiKey } = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        const selection = window.getSelection()?.toString() || '';
        setInput(selection);
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setConversation([]);
        setError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setInput(selectedText);
  }, [selectedText]);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !claudeApiKey || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage: Message = { role: 'user', content: input.trim() };
      setConversation(prev => [...prev, userMessage]);
      
      const result = await askClaude(claudeApiKey, input.trim(), conversation);
      const assistantMessage: Message = { role: 'assistant', content: result };
      
      setConversation(prev => [...prev, assistantMessage]);
      setInput('');
    } catch (err) {
      const error = err instanceof ApiError ? err : new Error('Failed to get response');
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <Command className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">Ask Claude</span>
        </div>

        {conversation.length > 0 && (
          <div 
            ref={conversationRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  message.role === 'assistant' 
                    ? 'bg-gray-50 rounded-lg p-4' 
                    : ''
                }`}
              >
                <div className="flex-1 whitespace-pre-wrap">
                  {message.content}
                </div>
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
                <div className="flex-1">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like to ask?"
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-[42px] min-h-[42px] max-h-32"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setConversation([]);
                  setError(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={!input.trim() || !claudeApiKey || isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}