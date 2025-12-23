'use client';

import { useState, useCallback } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { initialValue } from '@/src/lib/plate-config';

interface PlateEditorProps {
  pageType: 'happy' | 'sad';
  storageKey: string;
}

export default function PlateEditor({ pageType, storageKey }: PlateEditorProps) {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="border-2 border-gray-200 rounded-lg p-8 min-h-[500px] bg-white shadow-lg">
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
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
      
      <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
        <strong>Page Type:</strong> {pageType} | <strong>Storage Key:</strong> {storageKey}
      </div>
    </div>
  );
}