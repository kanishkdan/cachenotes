import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../utils/debounce';

interface Position {
  x: number;
  y: number;
}

export function useTextSelection() {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<Position | null>(null);

  const updateSelection = useCallback(
    debounce(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      
      if (text) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          const x = rect.left + (rect.width / 2);
          const y = rect.bottom + window.scrollY;
          
          setPosition({ x, y });
          setSelectedText(text);
        }
      } else {
        setPosition(null);
        setSelectedText('');
      }
    }, 100),
    []
  );

  useEffect(() => {
    const handleSelectionChange = () => {
      updateSelection();
    };

    const handleScroll = () => {
      setPosition(null);
      setSelectedText('');
    };

    const handleResize = debounce(() => {
      setPosition(null);
      setSelectedText('');
    }, 100);

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateSelection]);

  return { selectedText, position };
}