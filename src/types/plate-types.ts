import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

export type HappyTextElement = {
  type: 'happy-text';
  quoteId?: string;
  children: [{ text: string }];
};

export type SadTextElement = {
  type: 'sad-text';
  quoteId?: string;
  children: [{ text: string }];
};

export type ParagraphElement = {
  type: 'p';
  children: { text: string }[];
};

export type CustomElement =
  | HappyTextElement
  | SadTextElement
  | ParagraphElement;

export type CustomText = {
  text: string;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type EditorValue = Descendant[];

export interface StoredEditorContent {
  content: EditorValue;
  lastModified: string;
}