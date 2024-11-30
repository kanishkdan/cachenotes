import { useState, useEffect, useCallback, RefObject } from 'react';
import { debounce } from '../utils/debounce';

interface Position {
  x: number;
  y: number;
  height: number;
  width: number;
}

export function useHighlight(containerRef: RefObject<HTMLElement>) {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<Position | null>(null);

  const calculatePosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !containerRef.current) return null;

    const range = selection.getRangeAt(0);
    if (!range) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const selectionRect = range.getBoundingClientRect();

    // Check if selection is within container
    if (
      selectionRect.top < containerRect.top ||
      selectionRect.bottom > containerRect.bottom ||
      selectionRect.left < containerRect.left ||
      selectionRect.right > containerRect.right
    ) {
      return null;
    }

    return {
      x: selectionRect.left + (selectionRect.width / 2),
      y: selectionRect.top + window.scrollY,
      height: selectionRect.height,
      width: selectionRect.width
    };
  }, [containerRef]);

  const updateSelection = useCallback(
    debounce(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      
      if (text && containerRef.current?.contains(selection?.anchorNode as Node)) {
        const pos = calculatePosition();
        if (pos) {
          setPosition(pos);
          setSelectedText(text);
        }
      } else {
        setPosition(null);
        setSelectedText('');
      }
    }, 100),
    [calculatePosition]
  );

  useEffect(() => {
    const handleSelectionChange = () => {
      updateSelection();
    };

    const handleScroll = debounce(() => {
      const pos = calculatePosition();
      if (pos && selectedText) {
        setPosition(pos);
      } else {
        setPosition(null);
        setSelectedText('');
      }
    }, 100);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target as Node)
      ) {
        setPosition(null);
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateSelection, calculatePosition, selectedText, containerRef]);

  return { selectedText, position };
}