import React from 'react';

interface CharacterCountProps {
  text: string;
}

export function CharacterCount({ text }: CharacterCountProps) {
  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="text-sm text-gray-500">
      {charCount} characters · {wordCount} words
    </div>
  );
}