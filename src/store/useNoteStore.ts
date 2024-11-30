import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note } from '../types/Note';
import { Folder } from '../types/Folder';
import { ContentType, ThreadContent } from '../types/ContentType';

interface NoteStore {
  notes: Note[];
  folders: Folder[];
  contentTypes: Record<string, ContentType>;
  threadContents: Record<string, ThreadContent>;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  moveNote: (noteId: string, targetFolderId: string | null) => void;
  reorderNotes: (folderId: string | null, noteIds: string[]) => void;
  setContentType: (noteId: string, type: ContentType) => void;
  getContentType: (noteId: string) => ContentType;
  updateThreadContent: (noteId: string, content: ThreadContent) => void;
  getThreadContent: (noteId: string) => ThreadContent;
}

const initialState = {
  notes: [],
  folders: [],
  contentTypes: {},
  threadContents: {},
  noteOrder: []
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      addNote: (note) => 
        set((state) => {
          if (state.notes.some(n => n.id === note.id)) {
            return state;
          }
          return {
            notes: [...state.notes, { ...note, createdAt: new Date(note.createdAt) }],
            contentTypes: {
              ...state.contentTypes,
              [note.id]: 'note'
            }
          };
        }),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          folders: state.folders.map(folder => ({
            ...folder,
            noteIds: folder.noteIds.filter(noteId => noteId !== id)
          })),
          contentTypes: {
            ...state.contentTypes,
            [id]: undefined
          },
          threadContents: {
            ...state.threadContents,
            [id]: undefined
          }
        })),
      addFolder: (folder) =>
        set((state) => ({
          folders: [...state.folders, { ...folder, createdAt: new Date(folder.createdAt) }]
        })),
      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          ),
        })),
      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id)
        })),
      moveNote: (noteId, targetFolderId) =>
        set((state) => {
          const updatedFolders = state.folders.map(folder => ({
            ...folder,
            noteIds: folder.noteIds.filter(id => id !== noteId)
          }));

          if (targetFolderId !== null) {
            const targetFolder = updatedFolders.find(f => f.id === targetFolderId);
            if (targetFolder) {
              targetFolder.noteIds = [...targetFolder.noteIds, noteId];
            }
          }

          return { folders: updatedFolders };
        }),
      reorderNotes: (folderId, noteIds) =>
        set((state) => {
          if (folderId === null) {
            return { noteOrder: noteIds };
          }
          return {
            folders: state.folders.map(folder =>
              folder.id === folderId
                ? { ...folder, noteIds }
                : folder
            )
          };
        }),
      setContentType: (noteId, type) =>
        set((state) => ({
          contentTypes: {
            ...state.contentTypes,
            [noteId]: type
          }
        })),
      getContentType: (noteId) => {
        const state = get();
        return state.contentTypes[noteId] || 'note';
      },
      updateThreadContent: (noteId, content) =>
        set((state) => ({
          threadContents: {
            ...state.threadContents,
            [noteId]: content
          }
        })),
      getThreadContent: (noteId) => {
        const state = get();
        return state.threadContents[noteId] || { posts: [] };
      }
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          return {
            ...persistedState,
            contentTypes: {},
            threadContents: {}
          };
        }
        return persistedState;
      }
    }
  )
);