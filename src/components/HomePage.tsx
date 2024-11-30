import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, FolderPlus } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FolderList } from './FolderList';
import { SearchBar } from './SearchBar';
import { SettingsModal } from './SettingsModal';
import { useNoteStore } from '../store/useNoteStore';
import { generateUniqueId } from '../utils/noteUtils';
import { ShortcutHint } from './ShortcutHint';

export function HomePage() {
  const navigate = useNavigate();
  const { folders, notes, moveNote, reorderNotes, addFolder } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        handleNewFolder();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewFolder = () => {
    addFolder({
      id: generateUniqueId(),
      name: 'New Folder',
      createdAt: new Date(),
      noteIds: []
    });
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewFolder}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors group relative"
              title="Create Folder (F)"
            >
              <FolderPlus className="w-5 h-5" />
              <div className="absolute right-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ShortcutHint keys={['F']} />
              </div>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors group relative"
              title="Set Claude AI Key"
            >
              <Settings className="w-5 h-5" />
              <div className="absolute right-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                  Set Claude AI Key
                </span>
              </div>
            </button>
          </div>
        </div>

        <DndContext
          onDragEnd={(event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const activeId = active.id as string;
            const overId = over.id as string;

            const sourceFolder = folders.find(f => f.noteIds.includes(activeId));
            const targetFolder = folders.find(f => f.noteIds.includes(overId));
            
            if (sourceFolder?.id === targetFolder?.id) {
              const oldIndex = sourceFolder.noteIds.indexOf(activeId);
              const newIndex = sourceFolder.noteIds.indexOf(overId);
              if (oldIndex !== -1 && newIndex !== -1) {
                reorderNotes(sourceFolder.id, arrayMove(sourceFolder.noteIds, oldIndex, newIndex));
              }
            }
          }}
        >
          <FolderList folders={folders} filteredNotes={filteredNotes} />
        </DndContext>
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}