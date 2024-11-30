import { useEffect } from 'react';

export function useKeyboardShortcuts(handlers: {
  onNewNote?: () => void;
  onNewFolder?: () => void;
  onSettings?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the active element is an input or textarea
      const isInputActive = document.activeElement instanceof HTMLInputElement || 
                          document.activeElement instanceof HTMLTextAreaElement;

      // Only trigger if no modifier keys are pressed and not typing in an input
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !isInputActive) {
        if (e.key.toLowerCase() === 'n' && handlers.onNewNote) {
          e.preventDefault();
          handlers.onNewNote();
        } else if (e.key.toLowerCase() === 'f' && handlers.onNewFolder) {
          e.preventDefault();
          handlers.onNewFolder();
        } else if (e.key.toLowerCase() === 's' && handlers.onSettings) {
          e.preventDefault();
          handlers.onSettings();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}