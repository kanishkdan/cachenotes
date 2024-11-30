import React, { useEffect, useRef } from 'react';

interface BlockProps {
  content: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  onChange: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
}

const blockStyles = {
  paragraph: 'text-base leading-relaxed',
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base font-bold',
};

export function Block({ content, type, onChange, onKeyDown, autoFocus }: BlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    onChange(text);
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      dir="ltr"
      className={`outline-none ${blockStyles[type]} min-h-[1.5em] whitespace-pre-wrap`}
      onInput={handleInput}
      onKeyDown={onKeyDown}
    >
      {content}
    </div>
  );
}