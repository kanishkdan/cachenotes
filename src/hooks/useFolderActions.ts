import { useCallback } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { generateUniqueId } from '../utils/noteUtils';
import { Folder } from '../types/Folder';

export function useFolderActions() {
  const { addFolder, updateFolder, deleteFolder, moveNote } = useNoteStore();

  const createFolder = useCallback(() => {
    const newFolder: Folder = {
      id: generateUniqueId(),
      name: 'New Folder',
      createdAt: new Date(),
      noteIds: []
    };
    addFolder(newFolder);
    return newFolder.id;
  }, [addFolder]);

  const renameFolder = useCallback((id: string, name: string) => {
    updateFolder(id, { name });
  }, [updateFolder]);

  const removeFolder = useCallback((id: string) => {
    deleteFolder(id);
  }, [deleteFolder]);

  const moveNoteToFolder = useCallback((noteId: string, folderId: string | null) => {
    moveNote(noteId, folderId);
  }, [moveNote]);

  return {
    createFolder,
    renameFolder,
    removeFolder,
    moveNoteToFolder
  };
}