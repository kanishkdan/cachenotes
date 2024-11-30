import React, { useState, useCallback } from 'react';

interface Block {
  id: string;
  content: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
}

import { Block } from './Block';

export function NoteEditor({ content, onChange }: NoteEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    const lines = content.split('\n').filter(Boolean);
    if (lines.length === 0) return [{ id: '1', content: '', type: 'paragraph' }];
    
    return lines.map((line, index) => {
      const id = (index + 1).toString();
      if (line.startsWith('# ')) return { id, content: line.slice(2), type: 'h1' };
      if (line.startsWith('## ')) return { id, content: line.slice(3), type: 'h2' };
      if (line.startsWith('### ')) return { id, content: line.slice(4), type: 'h3' };
      return { id, content: line, type: 'paragraph' };
    });
  });

  const updateContent = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
    onChange(newBlocks.map(block => {
      if (block.type === 'h1') return `# ${block.content}`;
      if (block.type === 'h2') return `## ${block.content}`;
      if (block.type === 'h3') return `### ${block.content}`;
      return block.content;
    }).join('\n'));
  }, [onChange]);

  const handleBlockChange = (id: string, newContent: string) => {
    const blockIndex = blocks.findIndex(b => b.id === id);
    if (blockIndex === -1) return;

    const newBlocks = [...blocks];
    const block = newBlocks[blockIndex];

    if (newContent.startsWith('# ')) {
      block.type = 'h1';
      block.content = newContent.slice(2);
    } else if (newContent.startsWith('## ')) {
      block.type = 'h2';
      block.content = newContent.slice(3);
    } else if (newContent.startsWith('### ')) {
      block.type = 'h3';
      block.content = newContent.slice(4);
    } else {
      block.content = newContent;
    }

    updateContent(newBlocks);
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const blockIndex = blocks.findIndex(b => b.id === id);
      const newBlocks = [...blocks];
      const newId = Date.now().toString();
      newBlocks.splice(blockIndex + 1, 0, {
        id: newId,
        content: '',
        type: 'paragraph'
      });
      updateContent(newBlocks);
    }
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <Block
          key={block.id}
          content={block.content}
          type={block.type}
          onChange={(content) => handleBlockChange(block.id, content)}
          onKeyDown={(e) => handleKeyDown(block.id, e)}
          autoFocus={index === blocks.length - 1}
        />
      ))}
    </div>
  );
}