import React from 'react';
import { MessageCircle } from 'lucide-react';

interface TextSelectionToolbarProps {
  selectedText: string;
  onAskAI: (text: string) => void;
  position: { x: number; y: number };
}

export function TextSelectionToolbar({ selectedText, onAskAI, position }: TextSelectionToolbarProps) {
  if (!selectedText) return null;

  return (
    <div 
      className="fixed bg-white rounded-lg shadow-md border border-gray-200 py-1 px-1.5 z-50"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, 8px)'
      }}
    >
      <button
        onClick={() => onAskAI(selectedText)}
        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>Add to Chat</span>
      </button>
    </div>
  );
}