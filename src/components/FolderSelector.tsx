import React from 'react';
import { Folder } from '../types/Folder';
import { ChevronDown } from 'lucide-react';

interface FolderSelectorProps {
  folders: Folder[];
  currentFolderId: string | null;
  onFolderChange: (folderId: string | null) => void;
}

export function FolderSelector({ folders, currentFolderId, onFolderChange }: FolderSelectorProps) {
  const currentFolder = folders.find(f => f.id === currentFolderId);
  
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <span>{currentFolder?.name || 'Everything'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <div className="py-1">
          <button
            onClick={() => onFolderChange(null)}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
              currentFolderId === null ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
            }`}
          >
            Everything
          </button>
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                currentFolderId === folder.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
              }`}
            >
              {folder.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}