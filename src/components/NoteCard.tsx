import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useNoteStore } from '../store/useNoteStore';
import { formatDate } from '../utils/dateUtils';
import { DynamicText } from './DynamicText';

interface NoteCardProps {
  id: string;
  title: string;
  createdAt: Date;
  isDragging?: boolean;
}

export function NoteCard({ id, title, createdAt, isDragging }: NoteCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteNote = useNoteStore((state) => state.deleteNote);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNote(id);
    setShowConfirm(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  const cardContent = (
    <div className="group relative aspect-square p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 min-h-0">
          <DynamicText text={title || 'Untitled'} />
        </div>
        <p className="text-sm text-gray-400 mt-4">
          {formatDate(createdAt)}
        </p>
      </div>
      
      {!showConfirm && !isDragging && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-50"
          aria-label="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {showConfirm && !isDragging && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Delete this note?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isDragging) {
    return cardContent;
  }

  return (
    <Link to={`/note/${id}`} className="block">
      {cardContent}
    </Link>
  );
}