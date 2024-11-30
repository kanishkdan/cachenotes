import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNoteStore } from '../store/useNoteStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useChatStore } from '../store/useChatStore';
import { CharacterCount } from '../components/CharacterCount';
import { ChatDrawer } from '../components/ChatDrawer';
import { ShortcutHint } from '../components/ShortcutHint';
import { FolderSelector } from '../components/FolderSelector';
import { ContentTypePills } from '../components/ContentTypePills';
import { ThreadView } from '../components/TwitterThread/ThreadView';
import { askClaude } from '../utils/claude';
import { generateUniqueId } from '../utils/noteUtils';
import { Message } from '../types/Message';
import { ContentType } from '../types/ContentType';

export function NotePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    notes, 
    folders, 
    addNote, 
    updateNote, 
    deleteNote, 
    moveNote,
    getContentType,
    setContentType,
    getThreadContent,
    updateThreadContent
  } = useNoteStore();
  const { claudeApiKey } = useSettingsStore();
  const {
    getChats,
    getActiveChat,
    createChat,
    addMessage
  } = useChatStore();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const initialFolderId = location.state?.folderId || null;
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(initialFolderId);
  const [contentType, setContentTypeState] = useState<ContentType>('note');

  const activeChat = id ? getActiveChat(id) : undefined;
  const threadContent = id ? getThreadContent(id) : { posts: [] };

  useEffect(() => {
    if (id) {
      const existingNote = notes.find(note => note.id === id);
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
        setContentTypeState(getContentType(id));
        
        const folder = folders.find(f => f.noteIds.includes(id));
        setCurrentFolderId(folder?.id || null);
      } else {
        addNote({
          id,
          title: '',
          content: '',
          createdAt: new Date()
        });
        if (currentFolderId) {
          moveNote(id, currentFolderId);
        }
      }
    }
  }, [id, notes, folders, addNote, currentFolderId, moveNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isChatOpen) {
          setIsChatOpen(false);
        } else {
          handleBack();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleOpenChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen]);

  const handleBack = () => {
    if (id) {
      const note = notes.find(n => n.id === id);
      if (note && !note.title.trim() && !note.content.trim()) {
        deleteNote(id);
      }
    }
    navigate('/');
  };

  const handleFolderChange = (folderId: string | null) => {
    if (id) {
      moveNote(id, folderId);
      setCurrentFolderId(folderId);
    }
  };

  const handleContentTypeChange = (type: ContentType) => {
    if (id) {
      setContentTypeState(type);
      setContentType(id, type);
    }
  };

  const handleOpenChat = () => {
    if (!claudeApiKey) {
      const shouldSetup = window.confirm(
        'Claude API key is required for AI assistance. Would you like to set it up now?'
      );
      if (shouldSetup) {
        localStorage.setItem('show_settings', 'true');
        navigate('/');
      }
      return;
    }

    if (!id) return;

    setIsChatOpen(true);
    // Always create a new chat when opening
    createChat(id);
    setTimeout(() => chatInputRef.current?.focus(), 0);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !claudeApiKey || isLoading || !id || !activeChat) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: generateUniqueId(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };

    addMessage(id, activeChat.id, userMessage);
    setChatInput('');

    try {
      const context = {
        contentType,
        noteContent: contentType === 'note' ? content : undefined,
        threadContent: contentType === 'twitter-thread' ? threadContent : undefined
      };

      const response = await askClaude(
        claudeApiKey,
        chatInput.trim(),
        activeChat.messages,
        context
      );

      const assistantMessage: Message = {
        id: generateUniqueId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      addMessage(id, activeChat.id, assistantMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (id) {
      updateNote(id, { title: newTitle });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (id) {
      updateNote(id, { content: newContent });
    }
  };

  const handleThreadChange = (posts: any[]) => {
    if (id) {
      updateThreadContent(id, { posts });
    }
  };

  const handleAddToNote = (text: string) => {
    if (contentType === 'twitter-thread') {
      const newPost = {
        id: generateUniqueId(),
        content: text,
        createdAt: new Date()
      };
      handleThreadChange([...threadContent.posts, newPost]);
    } else {
      const newContent = content + (content ? '\n\n' : '') + text;
      setContent(newContent);
      if (id) {
        updateNote(id, { content: newContent });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group relative"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Notes</span>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ShortcutHint keys={['Esc']} />
            </div>
          </button>
          <button
            onClick={handleOpenChat}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 group relative"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat with AI</span>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ShortcutHint keys={['⌘', 'L']} />
            </div>
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="flex-1 text-3xl font-bold border-none outline-none placeholder-gray-300"
            autoFocus
          />
          <FolderSelector
            folders={folders}
            currentFolderId={currentFolderId}
            onFolderChange={handleFolderChange}
          />
        </div>

        <ContentTypePills
          selectedType={contentType}
          onTypeChange={handleContentTypeChange}
        />
        
        {contentType === 'note' ? (
          <>
            <div className="mb-8">
              <CharacterCount text={content} />
            </div>
            
            <div className="relative">
              <textarea
                ref={contentRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Start typing..."
                className="w-full min-h-[calc(100vh-300px)] p-4 resize-none border-none outline-none text-lg"
              />
            </div>
          </>
        ) : (
          <ThreadView
            posts={threadContent.posts}
            onChange={handleThreadChange}
          />
        )}
      </div>

      {id && (
        <ChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          noteId={id}
          input={chatInput}
          isLoading={isLoading}
          error={error}
          onInputChange={setChatInput}
          onSubmit={handleChatSubmit}
          onAddToNote={handleAddToNote}
          inputRef={chatInputRef}
        />
      )}
    </div>
  );
}