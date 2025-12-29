'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createEditor, Descendant, Transforms, Editor, Node } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderElementProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { initialValue, withHappySadElements, withInlineElements } from '@/src/lib/plate-config';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { useAI } from '@/src/hooks/useAI';
import { EditorValue } from '@/src/types/plate-types';
import { HappyElement } from './HappyElement';
import { SadElement } from './SadElement';

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
    const base = createEditor();
    const withReactEditor = withReact(base);
    const withHistoryEditor = withHistory(withReactEditor);
    const withInlinesEditor = withInlineElements(withHistoryEditor);
    const withHappySadEditor = withHappySadElements(withInlinesEditor);
    editorRef.current = withHappySadEditor as ReactEditor;
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
  
  // load from storage
  useEffect(() => {
    if (isClient && !isLoadingFromStorageRef.current && storedValue.length > 0) {
      isLoadingFromStorageRef.current = true;

      Editor.withoutNormalizing(editor, () => {
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });
        
        for (let i = editor.children.length - 1; i >= 0; i--) {
          Transforms.removeNodes(editor, { at: [i] });
        }
        
        for (let i = 0; i < storedValue.length; i++) {
          Transforms.insertNodes(editor, storedValue[i], { at: [i] });
        }
      });
    }
  }, [isClient, storedValue, editor]);

  const getCurrentValue = (): Descendant[] => {
    return editor.children as Descendant[];
  };

  const getEditorText = (editorValue: Descendant[]): string => {
    return editorValue
      .map((node) => Node.string(node))
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
    Editor.withoutNormalizing(editor, () => {
      Transforms.select(editor, {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      });

      Transforms.delete(editor);

      for (let i = editor.children.length - 1; i >= 0; i--) {
        Transforms.removeNodes(editor, { at: [i] });
      }

      Transforms.insertNodes(editor, {
        type: 'p',
        children: [{ text: newText }]
      } as any, { at: [0] });
    });
  };

  const handleAIRewrite = async (textToRewrite: string) => {
    if (!textToRewrite) return;
    
    setSaveStatus('saving');
    
    try {
      const rewrittenText = await rewriteText(textToRewrite);
      
      replaceEditorContent(rewrittenText);
      
      const newValue = getCurrentValue();
      setStoredValue(newValue);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
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
    Editor.withoutNormalizing(editor, () => {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
      
      for (let i = editor.children.length - 1; i >= 0; i--) {
        Transforms.removeNodes(editor, { at: [i] });
      }
      
      Transforms.insertNodes(editor, initialValue[0], { at: [0] });
    });

    setStoredValue(initialValue);
    setSaveStatus('idle');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'happy-text':
        return <HappyElement {...props} />;
      case 'sad-text':
        return <SadElement {...props} />;
      case 'p':
        return <p {...props.attributes}>{props.children}</p>;
      default:
        return <div {...props.attributes}>{props.children}</div>;
    }
  }, []);

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
            renderElement={renderElement}
            className="outline-none min-h-[400px] p-4"
            placeholder="Start Typing.."
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

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <div className="font-bold text-blue-900 mb-2">Features:</div>
        <div className="text-blue-700 space-y-2">
          <div>
            <strong>Clickable Words</strong>
            <div className="ml-4 text-xs mt-1">
              • Type "happy" + SPACE
              <br />
              • Type "sad" + SPACE
              <br />
              • Click any word to see a random quote
            </div>
          </div>
          <div>
            <strong>AI Rewrite</strong>
            <div className="ml-4 text-xs mt-1">
              • Type text, add "/rewrite" at end
              <br />
              • Example: "The weather is okay/rewrite"
              <br />
              • AI makes it {pageType}!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}