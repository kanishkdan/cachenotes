import React, { useState } from 'react';
import { Folder as FolderIcon, Pencil, Check, X, Trash2 } from 'lucide-react';
import { Folder } from '../types/Folder';
import { Note } from '../types/Note';
import { NoteGrid } from './NoteGrid';
import { useNoteStore } from '../store/useNoteStore';
import { NewNoteButton } from './NewNoteButton';

interface FolderListProps {
  folders: Folder[];
  filteredNotes: Note[];
}

interface EditableFolderTitleProps {
  folder: Folder;
  noteCount: number;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

function EditableFolderTitle({ folder, noteCount, onRename, onDelete }: EditableFolderTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editedName, setEditedName] = useState(folder.name);

  const handleSubmit = () => {
    if (editedName.trim()) {
      onRename(folder.id, editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(folder.name);
    setIsEditing(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">Delete this folder?</p>
        <button
          onClick={() => {
            onDelete(folder.id);
            setShowConfirm(false);
          }}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="text-lg font-medium bg-transparent border-b border-gray-300 focus:border-gray-600 outline-none"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <button
          onClick={handleSubmit}
          className="p-1 text-green-500 hover:text-green-600"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-red-500 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">{folder.name}</h2>
        <span className="px-2 py-0.5 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
          {noteCount} {noteCount === 1 ? 'note' : 'notes'}
        </span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          title="Rename folder"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
          title="Delete folder"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function FolderList({ folders = [], filteredNotes }: FolderListProps) {
  const updateFolder = useNoteStore((state) => state.updateFolder);
  const deleteFolder = useNoteStore((state) => state.deleteFolder);
  
  const unassignedNotes = filteredNotes.filter(note => 
    !folders.some(folder => folder.noteIds.includes(note.id))
  );

  const handleRename = (id: string, newName: string) => {
    updateFolder(id, { name: newName });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-gray-800">
            <FolderIcon className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Everything</h2>
              <span className="px-2 py-0.5 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
                {unassignedNotes.length} {unassignedNotes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>
          </div>
          <NewNoteButton />
        </div>
        <NoteGrid notes={unassignedNotes} folderId={null} />
        <hr className="my-8 border-gray-100" />
      </div>

      {folders.map((folder, index) => {
        const folderNotes = filteredNotes.filter(note => 
          folder.noteIds.includes(note.id)
        );

        return (
          <div key={folder.id}>
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 text-gray-800">
                <FolderIcon className="w-5 h-5" />
                <EditableFolderTitle 
                  folder={folder} 
                  noteCount={folderNotes.length}
                  onRename={handleRename}
                  onDelete={deleteFolder}
                />
              </div>
              <NewNoteButton folderId={folder.id} />
            </div>
            <NoteGrid notes={folderNotes} folderId={folder.id} />
            {index < folders.length - 1 && (
              <hr className="my-8 border-gray-100" />
            )}
          </div>
        );
      })}
    </div>
  );
}