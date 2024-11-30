import { useCallback } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { generateUniqueId } from '../utils/noteUtils';
import { Note } from '../types/Note';

export function useNoteActions() {
  const { addNote, updateNote, deleteNote } = useNoteStore();

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: generateUniqueId(),
      title: '',
      content: '',
      createdAt: new Date()
    };
    addNote(newNote);
    return newNote.id;
  }, [addNote]);

  const saveNote = useCallback((id: string, updates: Partial<Note>) => {
    updateNote(id, updates);
  }, [updateNote]);

  const removeNote = useCallback((id: string) => {
    deleteNote(id);
  }, [deleteNote]);

  return {
    createNote,
    saveNote,
    removeNote
  };
}