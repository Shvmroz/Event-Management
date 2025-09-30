import React, { useMemo, Suspense } from 'react';
import { lazy } from 'react';
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

const ReactQuill = lazy(() => import('react-quill'));

const QuillEditor: React.FC<QuillEditorProps> = ({
  value = '', 
  onChange = () => {},
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
      <Suspense fallback={
        <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading editor...</span>
        </div>
      }>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={disabled}
          modules={modules}
          formats={formats}
        />
      </Suspense>
      <style>{`
        .quill-editor-wrapper .ql-editor {
          min-height: ${editorMinHeight}px !important;
        }
      `}</style>
    </div>
  );
};

export default QuillEditor;
