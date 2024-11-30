import React, { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

interface Position {
  x: number;
  y: number;
  height: number;
  width: number;
}

interface FloatingButtonProps {
  position: Position;
  onClick: () => void;
  children?: React.ReactNode;
}

export function FloatingButton({ position, onClick, children }: FloatingButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if button would overflow viewport
    let adjustedX = position.x;
    if (position.x + buttonRect.width > viewportWidth) {
      adjustedX = viewportWidth - buttonRect.width - 10;
    } else if (position.x < buttonRect.width / 2) {
      adjustedX = buttonRect.width / 2 + 10;
    }

    // Adjust vertical position if button would overflow viewport
    let adjustedY = position.y;
    const topSpace = position.y - window.scrollY;
    const bottomSpace = viewportHeight - (position.y - window.scrollY);

    if (topSpace < buttonRect.height + 10) {
      // Place below selection if not enough space above
      adjustedY = position.y + position.height + 10;
    } else {
      // Place above selection with offset
      adjustedY = position.y - 10;
    }

    buttonRef.current.style.transform = `translate(-50%, -100%)`;
    buttonRef.current.style.left = `${adjustedX}px`;
    buttonRef.current.style.top = `${adjustedY}px`;
  }, [position]);

  return (
    <div 
      ref={buttonRef}
      className="fixed bg-white rounded-lg shadow-md border border-gray-200 py-1 px-1.5 z-50"
    >
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>Add to Chat</span>
      </button>
    </div>
  );
}