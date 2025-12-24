import { Editor, Transforms, Range, Element as SlateElement } from 'slate';

export const withSlashCommands = (editor: any) => {
  const { isInline, isVoid, normalizeNode } = editor;

  editor.isInline = (element: any) => {
    return isInline(element);
  };

  editor.isVoid = (element: any) => {
    return isVoid(element);
  };

  return editor;
};

export const detectSlashCommand = (editor: any): string | null => {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    return null;
  }

  const [start] = Range.edges(selection);
  const lineBefore = Editor.before(editor, start, { unit: 'line' });
  
  if (!lineBefore) {
    return null;
  }

  const lineRange = lineBefore && Editor.range(editor, lineBefore, start);
  const lineText = lineRange ? Editor.string(editor, lineRange) : '';

  if (lineText.endsWith('/rewrite')) {
    return lineText.slice(0, -8).trim(); // remove /rewrite and return the text before it
  }

  return null;
};

export const removeSlashCommand = (editor: any) => {
  const { selection } = editor;
  
  if (!selection) return;

  const [start] = Range.edges(selection);
  const lineBefore = Editor.before(editor, start, { unit: 'line' });
  
  if (!lineBefore) return;

  const lineRange = Editor.range(editor, lineBefore, start);
  const lineText = Editor.string(editor, lineRange);

  if (lineText.endsWith('/rewrite')) {
    const deleteRange = {
      anchor: {
        ...start,
        offset: start.offset - 8,
      },
      focus: start,
    };
    
    Transforms.delete(editor, { at: deleteRange });
  }
};

// replace text in editor
export const replaceLineText = (editor: any, newText: string) => {
  const { selection } = editor;
  
  if (!selection) return;

  const [start] = Range.edges(selection);
  const lineBefore = Editor.before(editor, start, { unit: 'line' });
  
  if (!lineBefore) return;

  const lineRange = Editor.range(editor, lineBefore, start);
  
  // delete the old text
  Transforms.delete(editor, { at: lineRange });
  
  Transforms.insertText(editor, newText);
};