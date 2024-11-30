import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Image, Smile, Link2, X } from 'lucide-react';
import { TwitterPost } from '../../types/ContentType';

interface ThreadPostProps {
  post: TwitterPost;
  index: number;
  nextPost?: TwitterPost;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  isPremium?: boolean;
}

export function ThreadPost({ post, index, nextPost, onUpdate, onDelete, isPremium = false }: ThreadPostProps) {
  const [content, setContent] = useState(post.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate(post.id, newContent);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const charCount = content.length;
  const charLimit = isPremium ? Infinity : 280;
  const isOverLimit = charCount > charLimit;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-100 shadow-sm mb-4 overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        <div className="flex flex-col items-center">
          <div
            {...attributes}
            {...listeners}
            className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 cursor-grab hover:bg-gray-300 transition-colors"
          />
          {nextPost && (
            <div className="w-0.5 flex-1 bg-gray-200 my-2" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm font-bold text-gray-900">Username</span>
            <span className="text-sm text-gray-500">@handle</span>
          </div>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              placeholder={index === 0 ? "What's happening?" : "Add to thread..."}
              className="w-full resize-none border-0 focus:ring-0 p-0 text-gray-900 placeholder-gray-500 text-base min-h-[60px] overflow-hidden"
              style={{ outline: 'none' }}
            />
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                  <Link2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                {!isPremium && (
                  <span className={`text-xs ${
                    isOverLimit ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {charCount}/280
                  </span>
                )}
                
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}