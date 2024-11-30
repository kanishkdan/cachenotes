import React, { useEffect, useRef, useState } from 'react';

interface DynamicTextProps {
  text: string;
  className?: string;
}

export function DynamicText({ text, className = '' }: DynamicTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(32); // Start with large font size

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    
    if (!container || !textElement) return;

    const calculateIdealFontSize = () => {
      const maxHeight = container.clientHeight;
      const maxWidth = container.clientWidth;
      let currentSize = 32; // Start size
      const minSize = 16; // Minimum font size
      
      while (currentSize > minSize) {
        textElement.style.fontSize = `${currentSize}px`;
        
        if (textElement.scrollHeight <= maxHeight && 
            textElement.scrollWidth <= maxWidth) {
          break;
        }
        
        currentSize -= 1;
      }
      
      setFontSize(currentSize);
    };

    calculateIdealFontSize();
    
    const observer = new ResizeObserver(calculateIdealFontSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, [text]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <div
        ref={textRef}
        style={{ fontSize: `${fontSize}px` }}
        className={`font-semibold text-gray-900 leading-tight ${className}`}
      >
        {text || 'Untitled'}
      </div>
    </div>
  );
}