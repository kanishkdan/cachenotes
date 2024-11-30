import React from 'react';
import { NoteCard } from './NoteCard';
import { Note } from '../types/Note';

interface NoteListProps {
  notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
  return (
    <>
      {notes.map((note) => (
        <NoteCard 
          key={note.id} 
          id={note.id} 
          title={note.title} 
          createdAt={note.createdAt}
        />
      ))}
    </>
  );
}