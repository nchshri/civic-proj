import { AutoformatRule } from '@platejs/autoformat';
import { SlateEditor } from 'platejs';
import { Transforms, Element, Editor } from 'slate';

export const happySadAutoformatRules: AutoformatRule[] = [
  {
    mode: 'text',
    match: ' happy ',
    format: (editor: SlateEditor) => {
      const slateEditor = editor as unknown as Editor;
      
      Transforms.delete(slateEditor, { distance: 7, unit: 'character', reverse: true });
      
      Transforms.insertNodes(slateEditor, {
        type: 'happy-text',
        children: [{ text: 'happy' }],
      } as Element);

      Transforms.insertText(slateEditor, ' ');
    },
  },
  {
    mode: 'text',
    match: ' sad ',
    format: (editor: SlateEditor) => {
      const slateEditor = editor as unknown as Editor;
      
      Transforms.delete(slateEditor, { distance: 5, unit: 'character', reverse: true });

      Transforms.insertNodes(slateEditor, {
        type: 'sad-text',
        children: [{ text: 'sad' }],
      } as Element);

      Transforms.insertText(slateEditor, ' ');
    },
  },
];