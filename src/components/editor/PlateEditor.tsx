'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createEditor, Descendant, Transforms } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { initialValue } from '@/src/lib/plate-config';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { useAI } from '@/src/hooks/useAI';
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
  
  const editorRef = useRef<ReactEditor | null>(null);
  if (!editorRef.current) {
    editorRef.current = withHistory(withReact(createEditor())) as ReactEditor;
  }
  const editor = editorRef.current;
  
  const [isClient, setIsClient] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingFromStorageRef = useRef(false);
  
  const { rewriteText, isLoading: isAILoading, error: aiError } = useAI({ tone: pageType });
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient && !isLoadingFromStorageRef.current) {
      isLoadingFromStorageRef.current = true;

      Transforms.delete(editor, {
        at: {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [editor.children.length - 1, 0], offset: 0 },
        },
      });
      
      Transforms.removeNodes(editor, { at: [0] });
      for (let i = 0; i < storedValue.length; i++) {
        Transforms.insertNodes(editor, storedValue[i], { at: [i] });
      }
    }
  }, [isClient, storedValue, editor]);

  const getCurrentValue = (): Descendant[] => {
    return editor.children as Descendant[];
  };

  const getEditorText = (editorValue: Descendant[]): string => {
    return editorValue
      .map((node: any) => {
        if (node.children) {
          return node.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .join('\n');
  };

  const checkForSlashCommand = (text: string) => {
    if (text.trim().endsWith('/rewrite')) {
      return {
        shouldRewrite: true,
        textToRewrite: text.trim().slice(0, -8).trim()
      };
    }
    return { shouldRewrite: false, textToRewrite: '' };
  };

  const replaceEditorContent = (newText: string) => {
    Transforms.select(editor, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [editor.children.length - 1, 0], offset: 0 },
    });

    Transforms.delete(editor);

    for (let i = editor.children.length - 1; i >= 0; i--) {
      Transforms.removeNodes(editor, { at: [i] });
    }
    
    Transforms.insertNodes(editor, {
      children: [{ text: newText }]
    }, { at: [0] });
  };

  const handleAIRewrite = async (textToRewrite: string) => {
    if (!textToRewrite) return;
    
    console.log('AI rewriting:', textToRewrite);
    setSaveStatus('saving');
    
    try {
      const rewrittenText = await rewriteText(textToRewrite);
      console.log('AI returned:', rewrittenText);
      
      replaceEditorContent(rewrittenText);
      
      const newValue = getCurrentValue();
      setStoredValue(newValue);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('AI error:', error);
      setSaveStatus('idle');
    }
  };

  const handleChange = useCallback(() => {
    const currentValue = getCurrentValue();
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    const text = getEditorText(currentValue);
    const { shouldRewrite, textToRewrite } = checkForSlashCommand(text);
    
    if (shouldRewrite && textToRewrite && !isAILoading) {
      handleAIRewrite(textToRewrite);
      return;
    }
    
    setSaveStatus('saving');
    saveTimeoutRef.current = setTimeout(() => {
      setStoredValue(currentValue);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  }, [setStoredValue, isAILoading]);

  const handleClear = () => {
    Transforms.delete(editor, {
      at: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [editor.children.length - 1, 0], offset: 0 },
      },
    });
    
    for (let i = editor.children.length - 1; i >= 0; i--) {
      Transforms.removeNodes(editor, { at: [i] });
    }
    
    Transforms.insertNodes(editor, initialValue[0], { at: [0] });

    setStoredValue(initialValue);
    setSaveStatus('idle');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="border-2 border-gray-200 rounded-lg p-8 min-h-[500px] bg-white shadow-lg flex items-center justify-center">
          <div className="text-gray-400 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {aiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {aiError}
        </div>
      )}

      <div className="border-2 border-gray-200 rounded-lg p-8 min-h-[500px] bg-white shadow-lg relative">
        <div className="absolute top-4 right-4">
          {isAILoading && (
            <span className="flex items-center gap-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              AI Working...
            </span>
          )}
          {saveStatus === 'saving' && !isAILoading && (
            <span className="flex items-center gap-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Saved
            </span>
          )}
        </div>

        <Slate 
          editor={editor}
          initialValue={initialValue}
          onChange={handleChange}
        >
          <Editable
            className="outline-none min-h-[400px] p-4"
            placeholder="Start typing... Type /rewrite at the end to transform"
            readOnly={isAILoading}
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
            }}
          />
        </Slate>
      </div>
      
      <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-600">
          <div className="font-medium">{storageKey}</div>
          <div className="text-xs text-gray-500 mt-1">
            {saveStatus}
          </div>
        </div>
        <button
          onClick={handleClear}
          disabled={isAILoading}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
        <div className="font-medium text-blue-900 mb-1">Instructions:</div>
        <div className="text-blue-700 space-y-1">
          <div>1. Type: "The weather is okay"</div>
          <div>2. Type: "/rewrite" (full text: "The weather is okay/rewrite")</div>
          <div>3. AI transforms it to be {pageType}!</div>
        </div>
      </div>
    </div>
  );
}