'use client';

import * as React from 'react';
import { normalizeNodeId } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/src/components/editor/editor-kit';
import { SettingsDialog } from '@/src/components/editor/settings-dialog';
import { Editor, EditorContainer } from '@/src/components/ui/editor';
import { AIChatPlugin } from '@platejs/ai/react';

interface PlateEditorProps {
  pageType: 'happy' | 'sad';
  storageKey: string;
}

//extend window for pageType
declare global {
  interface Window {
    __editorPageType?: 'happy' | 'sad';
  }
}

// type for AI plugin options with chatOptions
interface AIChatPluginOptions {
  chatOptions?: {
    api?: string;
    body?: Record<string, unknown>;
  };
  [key: string]: unknown;
}

export default function PlateEditor({ pageType, storageKey }: PlateEditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: () => {
      if (typeof window === 'undefined') return value;
      const savedValue = localStorage.getItem(storageKey);
      return savedValue ? JSON.parse(savedValue) : value;
    },
  });

  React.useEffect(() => {
    if (editor) {
      const currentOptions = editor.getOptions(AIChatPlugin) as AIChatPluginOptions;
      const chatOptions = currentOptions?.chatOptions || {};
      const existingBody = chatOptions?.body || {};
      
      editor.setOptions(AIChatPlugin, {
        ...currentOptions,
        chatOptions: {
          ...chatOptions,
          body: {
            ...existingBody,
            pageType,
          },
        },
      } as unknown as Parameters<typeof editor.setOptions<typeof AIChatPlugin>>[1]);
      
    }
  }, [editor, pageType]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__editorPageType = pageType;
    }
  }, [pageType]);

  return (
    <Plate 
      editor={editor}
      onChange={({ value }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      }}
    >
      <EditorContainer>
        <Editor />
      </EditorContainer>

      <SettingsDialog />
    </Plate>
  );
}

const value = normalizeNodeId([
  {
    children: [{ text: "Welcome!" }],
    type: 'h1',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [{ text: 'Features' }],
    type: 'h2',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [{ text: '1. AI-Powered Rewriting' }],
    type: 'h3',
  },
  {
    children: [
      { text: 'Select any text and press ' },
      { kbd: true, text: '⌘+J' },
      { text: ' (Mac) or ' },
      { kbd: true, text: 'Ctrl+J' },
      { text: ' (Windows) to open the AI menu. Click ' },
      { bold: true, text: 'Rewrite' },
      { text: ' to transform your text with the page\'s tone!' },
    ],
    type: 'p',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [{ text: '2. Interactive Happy/Sad Elements' }],
    type: 'h3',
  },
  {
    children: [
      { text: 'Type ' },
      { code: true, text: 'happy ' },
      { text: ' or ' },
      { code: true, text: 'sad ' },
      { text: ' (with a space after) to create clickable elements. Try it below:' },
    ],
    type: 'p',
  },
  {
    children: [
      { text: 'I feel ' },
      { children: [{ text: 'happy' }], type: 'happy-text' },
      { text: ' today, but sometimes I feel ' },
      { children: [{ text: 'sad' }], type: 'sad-text' },
      { text: ' too.' },
    ],
    type: 'p',
  },
  {
    children: [
      { text: 'Click the colored words above to see inspirational quotes!' },
    ],
    type: 'p',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [{ text: '3. Rich Text Formatting' }],
    type: 'h3',
  },
  {
    children: [
      { text: 'Use the toolbar for ' },
      { bold: true, text: 'bold' },
      { text: ', ' },
      { italic: true, text: 'italic' },
      { text: ', and ' },
      { text: 'underline', underline: true },
      { text: ' text. Add headings, blockquotes, and more!' },
    ],
    type: 'p',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [{ text: '4. Auto-Save' }],
    type: 'h3',
  },
  {
    children: [
      { text: 'Your content automatically saves to local storage. Refresh the page and your work will still be here!' },
    ],
    type: 'p',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [{ text: 'Try It Out' }],
    type: 'h2',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [
      {
        children: [
          { text: 'Select this text and press ⌘+J to rewrite it with AI, or clear everything below and start writing your own content!' },
        ],
        type: 'p',
      },
    ],
    type: 'blockquote',
  },
  {
    children: [{ text: '' }],
    type: 'p',
  },
  {
    children: [{ text: 'Start typing here...' }],
    type: 'p',
  },
]);