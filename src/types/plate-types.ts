import { Descendant } from 'slate';

export interface HappyTextElement {
  type: 'happy-text';
  children: Descendant[];
}

export interface SadTextElement {
  type: 'sad-text';
  children: Descendant[];
}

export type EditorValue = Descendant[];

export interface StoredEditorContent {
  content: EditorValue;
  lastModified: string;
}