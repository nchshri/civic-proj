import { Editor, Element, Node, Text, Transforms } from 'slate';

interface ExtendEditorContext {
  editor: Editor;
}

export const withHappySadTransform = ({ editor }: ExtendEditorContext) => {
  const { insertText } = editor;

  editor.insertText = (text: string) => {
    if (text === ' ') {
      try {
        const { selection } = editor;
        
        if (!selection) {
          insertText(text);
          return;
        }
        
        const nodeEntry = Editor.node(editor, selection);
        
        if (!nodeEntry) {
          insertText(text);
          return;
        }
        
        const [node] = nodeEntry;
        
        if (!Text.isText(node) || typeof node.text !== 'string') {
          insertText(text);
          return;
        }
        
        const beforeText = node.text;
        
        if (beforeText.endsWith('happy')) {
          Transforms.delete(editor, { distance: 5, reverse: true });
          
          Transforms.insertNodes(editor, {
            type: 'happy-text',
            children: [{ text: 'happy' }],
          } as Element);

          Transforms.move(editor, { unit: 'offset' });

          insertText(' ');
          
          return;
        }
        
        if (beforeText.endsWith('sad')) {
          Transforms.delete(editor, { distance: 3, reverse: true });

          Transforms.insertNodes(editor, {
            type: 'sad-text',
            children: [{ text: 'sad' }],
          } as Element);

          Transforms.move(editor, { unit: 'offset' });

          insertText(' ');
          
          return;
        }
      } catch (error) {
        console.error('Error in withHappySadTransform:', error);
      }
    }

    insertText(text);
  };

  return editor;
};