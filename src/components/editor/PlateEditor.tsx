'use client';

import { useState, useCallback, useEffect } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { initialValue } from '@/src/lib/plate-config';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { EditorValue } from '@/src/types/plate-types';

interface PlateEditorProps {
  pageType: 'happy' | 'sad';
  storageKey: string;
}

export default function PlateEditor({ pageType, storageKey }: PlateEditorProps) {
  const [storedValue, setStoredValue] = useLocalStorage<EditorValue>(
    storageKey,
    initialValue
  );
  
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [value, setValue] = useState<Descendant[]>(storedValue);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    setValue(storedValue);
  }, [storedValue]);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
    setSaveStatus('saving');
    
    setTimeout(() => {
      setStoredValue(newValue as EditorValue);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  }, [setStoredValue]);

  const handleClear = () => {
    setValue(initialValue);
    setStoredValue(initialValue);
    setSaveStatus('idle');
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="border-2 border-gray-200 rounded-lg p-8 min-h-[500px] bg-white shadow-lg flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  const editorKey = `editor-${storageKey}-${JSON.stringify(value).substring(0, 50)}`;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="border-2 border-gray-200 rounded-lg p-8 min-h-[500px] bg-white shadow-lg relative">
        <div className="absolute top-4 right-4">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Saved!
            </span>
          )}
        </div>

        <Slate 
          key={editorKey}
          editor={editor}
          initialValue={value}
          onChange={handleChange}
        >
          <Editable
            className="outline-none min-h-[400px] p-4 prose prose-slate max-w-none focus:outline-none"
            placeholder="Start typing..."
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'inherit',
            }}
          />
        </Slate>
      </div>
      
      <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <div className="font-medium">{storageKey}</div>
          <div className="text-xs text-gray-500 mt-1">
            Status: {saveStatus}
          </div>
        </div>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}