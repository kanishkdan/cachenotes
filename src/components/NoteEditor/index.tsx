import React, { useState } from 'react';
import { Editor } from './Editor';
import { MarkdownPreview } from './MarkdownPreview';
import { NoteToolbar } from '../NoteToolbar';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  onAskAI: (text: string) => void;
}

export function NoteEditor({ content, onChange, onAskAI }: NoteEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <NoteToolbar 
        isPreview={isPreview} 
        onTogglePreview={() => setIsPreview(!isPreview)} 
      />
      {isPreview ? (
        <MarkdownPreview content={content} />
      ) : (
        <Editor 
          content={content} 
          onChange={onChange}
          onAskAI={onAskAI}
        />
      )}
    </div>
  );
}