import React from 'react';

interface ShortcutHintProps {
  keys: string[];
  className?: string;
}

export function ShortcutHint({ keys, className = '' }: ShortcutHintProps) {
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <kbd className="px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded border border-gray-200">
            {key}
          </kbd>
          {index < keys.length - 1 && <span className="text-gray-400">+</span>}
        </React.Fragment>
      ))}
    </div>
  );
}