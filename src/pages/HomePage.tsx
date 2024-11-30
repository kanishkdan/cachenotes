import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  closestCenter
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Settings, FolderPlus } from 'lucide-react';
import { FolderList } from '../components/FolderList';
import { SearchBar } from '../components/SearchBar';
import { useNoteStore } from '../store/useNoteStore';
import { SettingsModal } from '../components/SettingsModal';
import { generateUniqueId } from '../utils/noteUtils';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
};

export function HomePage() {
  const navigate = useNavigate();
  const { folders, notes, moveNote, reorderNotes, addFolder, addNote } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const handleNewNote = () => {
    const newNoteId = generateUniqueId();
    addNote({
      id: newNoteId,
      title: '',
      content: '',
      createdAt: new Date()
    });
    navigate(`/note/${newNoteId}`);
  };

  const handleNewFolder = () => {
    addFolder({
      id: generateUniqueId(),
      name: 'New Folder',
      createdAt: new Date(),
      noteIds: []
    });
  };

  useKeyboardShortcuts({
    onNewNote: handleNewNote,
    onNewFolder: handleNewFolder,
    onSettings: () => setShowSettings(true)
  });

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (folders.some(folder => folder.id === overId) || overId === 'everything') {
      moveNote(activeId, overId === 'everything' ? null : overId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceFolder = folders.find(f => f.noteIds.includes(activeId));
    const targetFolder = folders.find(f => f.noteIds.includes(overId));
    
    if (sourceFolder && targetFolder && sourceFolder.id === targetFolder.id) {
      const oldIndex = sourceFolder.noteIds.indexOf(activeId);
      const newIndex = sourceFolder.noteIds.indexOf(overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newNoteIds = arrayMove([...sourceFolder.noteIds], oldIndex, newIndex);
        reorderNotes(sourceFolder.id, newNoteIds);
      }
    } else if (!sourceFolder && !targetFolder) {
      const unassignedNotes = notes
        .filter(note => !folders.some(f => f.noteIds.includes(note.id)))
        .map(note => note.id);
      
      const oldIndex = unassignedNotes.indexOf(activeId);
      const newIndex = unassignedNotes.indexOf(overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove([...unassignedNotes], oldIndex, newIndex);
        reorderNotes(null, newOrder);
      }
    }
  };

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
              <div className="absolute right-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                  Create Folder (F)
                </span>
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
                  Set Claude AI Key (S)
                </span>
              </div>
            </button>
          </div>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          dropAnimation={dropAnimation}
        >
          <FolderList folders={folders} filteredNotes={filteredNotes} />
        </DndContext>
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}