import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { Note } from '../types/Note';
import { SortableNote } from './SortableNote';

interface NoteGridProps {
  notes: Note[];
  folderId: string | null;
}

export function NoteGrid({ notes, folderId }: NoteGridProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folderId || 'everything'
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`note-grid grid gap-6 p-4 rounded-lg transition-colors ${
        isOver ? 'bg-gray-50' : ''
      }`}
    >
      <SortableContext 
        items={notes.map(note => note.id)}
        strategy={rectSortingStrategy}
      >
        {notes.map((note) => (
          <SortableNote
            key={note.id}
            id={note.id}
            title={note.title}
            createdAt={note.createdAt}
          />
        ))}
      </SortableContext>
    </div>
  );
}