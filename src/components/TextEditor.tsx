import React, { useRef } from 'react';
import { useHighlight } from '../hooks/useHighlight';
import { FloatingButton } from './FloatingButton';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onAskAI: (text: string) => void;
  placeholder?: string;
}

export function TextEditor({ content, onChange, onAskAI, placeholder }: TextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedText, position } = useHighlight(containerRef);

  return (
    <div className="relative" ref={containerRef}>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[calc(100vh-300px)] p-4 resize-none border-none outline-none text-lg font-mono"
      />
      {position && selectedText && (
        <FloatingButton
          position={position}
          onClick={() => onAskAI(selectedText)}
        />
      )}
    </div>
  );
}