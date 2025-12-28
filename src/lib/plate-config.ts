import { Editor, Element as SlateElement, Transforms, Text, Node, Range } from 'slate';
import { EditorValue } from '../types/plate-types';

export const initialValue: EditorValue = [
  {
    type: 'p',
    children: [{ text: '' }],
  },
];

export const withHappySadElements = (editor: Editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'happy-text' || element.type === 'sad-text'
      ? true
      : isInline(element);
  };

  return editor;
};

export const convertWordToElement = (editor: Editor, word: 'happy' | 'sad') => {
  const { selection } = editor;
  
  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  try {
    const [start] = Range.edges(selection);
    
    const wordBefore = Editor.before(editor, start, { unit: 'word' });
    if (!wordBefore) return false;

    const wordRange = Editor.range(editor, wordBefore, start);
    const wordText = Editor.string(editor, wordRange).trim().toLowerCase();

    if (wordText === word) {
      Transforms.delete(editor, { at: wordRange });

      Transforms.insertNodes(editor, {
        type: `${word}-text` as 'happy-text' | 'sad-text',
        children: [{ text: word }],
      });

      Transforms.insertText(editor, ' ');
      
      return true;
    }
  } catch (error) {
    console.error('Error converting word:', error);
  }

  return false;
};

export const withInlineElements = (editor: Editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    if (text === ' ') {
      const converted = 
        convertWordToElement(editor, 'happy') || 
        convertWordToElement(editor, 'sad');
      
      if (converted) {
        return;
      }
    }

    insertText(text);
  };

  return editor;
};