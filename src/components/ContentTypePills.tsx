import React from 'react';
import { ContentType } from '../types/ContentType';

interface ContentTypePillsProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

export function ContentTypePills({ selectedType, onTypeChange }: ContentTypePillsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTypeChange('note')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedType === 'note'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Note
      </button>
      <button
        onClick={() => onTypeChange('twitter-thread')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedType === 'twitter-thread'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Twitter Thread
      </button>
    </div>
  );
}