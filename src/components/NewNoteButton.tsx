import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateUniqueId } from '../utils/noteUtils';
import { useNoteStore } from '../store/useNoteStore';
import { ShortcutHint } from './ShortcutHint';

interface NewNoteButtonProps {
  folderId?: string | null;
}

export function NewNoteButton({ folderId }: NewNoteButtonProps) {
  const navigate = useNavigate();
  const { addNote, moveNote } = useNoteStore();

  const handleNewNote = () => {
    const newNoteId = generateUniqueId();
    addNote({
      id: newNoteId,
      title: '',
      content: '',
      createdAt: new Date()
    });
    
    if (folderId) {
      moveNote(newNoteId, folderId);
    }
    
    navigate(`/note/${newNoteId}`, { state: { folderId } });
  };

  return (
    <button
      onClick={handleNewNote}
      className="text-gray-400 hover:text-gray-600 transition-colors group relative"
      title="Create Note (N)"
    >
      <PlusCircle className="w-5 h-5" />
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ShortcutHint keys={['N']} />
      </div>
    </button>
  );
}