import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { ThreadPost } from './ThreadPost';
import { TwitterPost } from '../../types/ContentType';
import { generateUniqueId } from '../../utils/noteUtils';

interface ThreadViewProps {
  posts: TwitterPost[];
  onChange: (posts: TwitterPost[]) => void;
}

export function ThreadView({ posts, onChange }: ThreadViewProps) {
  const [isPremium, setIsPremium] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = posts.findIndex(post => post.id === active.id);
    const newIndex = posts.findIndex(post => post.id === over.id);

    const newPosts = [...posts];
    const [movedPost] = newPosts.splice(oldIndex, 1);
    newPosts.splice(newIndex, 0, movedPost);
    
    onChange(newPosts);
  };

  const handleAddPost = () => {
    const newPost: TwitterPost = {
      id: generateUniqueId(),
      content: '',
      createdAt: new Date()
    };
    onChange([...posts, newPost]);
  };

  const handleUpdatePost = (id: string, content: string) => {
    const newPosts = posts.map(post =>
      post.id === id ? { ...post, content } : post
    );
    onChange(newPosts);
  };

  const handleDeletePost = (id: string) => {
    const newPosts = posts.filter(post => post.id !== id);
    onChange(newPosts);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Disable Char Limit</span>
          </label>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={posts.map(post => post.id)}
          strategy={verticalListSortingStrategy}
        >
          {posts.map((post, index) => (
            <ThreadPost
              key={post.id}
              post={post}
              index={index}
              nextPost={posts[index + 1]}
              onUpdate={handleUpdatePost}
              onDelete={handleDeletePost}
              isPremium={isPremium}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={handleAddPost}
        className="w-full py-3 flex items-center justify-center gap-2 text-blue-500 bg-white border border-blue-500 rounded-full hover:bg-blue-50 transition-colors mt-4"
      >
        <Plus className="w-5 h-5" />
        <span>Add Tweet</span>
      </button>
    </div>
  );
}