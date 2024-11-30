import React, { useRef, useEffect } from 'react';
import { useTextSelection } from '../../hooks/useTextSelection';
import { TextSelectionToolbar } from '../TextSelectionToolbar';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onAskAI: (text: string) => void;
  placeholder?: string;
}

export function Editor({ content, onChange, onAskAI, placeholder = 'Start typing...' }: EditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { selectedText, position } = useTextSelection();

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative">
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[calc(100vh-300px)] p-4 resize-none border-none outline-none text-lg font-mono"
      />
      {position && selectedText && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <TextSelectionToolbar
            selectedText={selectedText}
            onAskAI={onAskAI}
          />
        </div>
      )}
    </div>
  );
}