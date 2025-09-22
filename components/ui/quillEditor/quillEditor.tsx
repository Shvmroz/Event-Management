'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import '@/components/ui/quillEditor/quillEditor.css';

interface QuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  rows?: number;
}

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 dark:text-white animate-pulse">
      Loading editor...
    </div>
  )
});

const QuillEditor: React.FC<QuillEditorProps> = ({
  value = '',                  // default empty string
  onChange = () => {},          // default noop
  placeholder = 'Enter description...',
  disabled = false,
  className = '',
  style,
  rows = 4,
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'link'
  ];

  const editorMinHeight = rows * 24; 

  return (
    <div className={`quill-editor-wrapper ${className}`} style={style}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={disabled}
        modules={modules}
        formats={formats}
      />
      <style jsx global>{`
        .quill-editor-wrapper .ql-editor {
          min-height: ${editorMinHeight}px !important;
        }
      `}</style>
    </div>
  );
};

export default QuillEditor;
