import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerText;
    onChange(newContent);
  };

  React.useEffect(() => {
    if (editorRef.current && !editorRef.current.innerText) {
      editorRef.current.innerText = content;
    }
  }, [content]);

  return (
    <div className="flex flex-col space-y-4">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-[calc(100vh-300px)] outline-none text-lg p-4 whitespace-pre-wrap font-mono"
        placeholder="Start typing..."
      />
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}