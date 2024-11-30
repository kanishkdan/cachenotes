import React from 'react';
import { ArrowLeft, Eye, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoteToolbarProps {
  isPreview: boolean;
  onTogglePreview: () => void;
}

export function NoteToolbar({ isPreview, onTogglePreview }: NoteToolbarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Notes</span>
      </button>
      
      <button
        onClick={onTogglePreview}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        {isPreview ? (
          <>
            <Edit2 className="w-5 h-5" />
            <span>Edit</span>
          </>
        ) : (
          <>
            <Eye className="w-5 h-5" />
            <span>Preview</span>
          </>
        )}
      </button>
    </div>
  );
}