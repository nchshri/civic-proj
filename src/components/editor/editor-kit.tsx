'use client';

import { type Value, TrailingBlockPlugin } from 'platejs';
import { type TPlateEditor, useEditorRef } from 'platejs/react';

import { AutoformatPlugin } from '@platejs/autoformat';
import { HappyPlugin, SadPlugin, HappySadTransformPlugin } from '@/src/lib/happy-sad-plugins';
import { happySadAutoformatRules } from '@/src/lib/autoformat';
import { AIKit } from '@/src/components/editor/plugins/ai-kit';
import { AlignKit } from '@/src/components/editor/plugins/align-kit';
import { AutoformatKit } from '@/src/components/editor/plugins/autoformat-kit';
import { BasicBlocksKit } from '@/src/components/editor/plugins/basic-blocks-kit';
import { BasicMarksKit } from '@/src/components/editor/plugins/basic-marks-kit';
import { BlockMenuKit } from '@/src/components/editor/plugins/block-menu-kit';
import { BlockPlaceholderKit } from '@/src/components/editor/plugins/block-placeholder-kit';
import { CalloutKit } from '@/src/components/editor/plugins/callout-kit';
import { CodeBlockKit } from '@/src/components/editor/plugins/code-block-kit';
import { ColumnKit } from '@/src/components/editor/plugins/column-kit';
import { CommentKit } from '@/src/components/editor/plugins/comment-kit';
import { CopilotKit } from '@/src/components/editor/plugins/copilot-kit';
import { CursorOverlayKit } from '@/src/components/editor/plugins/cursor-overlay-kit';
import { DateKit } from '@/src/components/editor/plugins/date-kit';
import { DiscussionKit } from '@/src/components/editor/plugins/discussion-kit';
import { DndKit } from '@/src/components/editor/plugins/dnd-kit';
import { DocxKit } from '@/src/components/editor/plugins/docx-kit';
import { EmojiKit } from '@/src/components/editor/plugins/emoji-kit';
import { ExitBreakKit } from '@/src/components/editor/plugins/exit-break-kit';
import { FixedToolbarKit } from '@/src/components/editor/plugins/fixed-toolbar-kit';
import { FloatingToolbarKit } from '@/src/components/editor/plugins/floating-toolbar-kit';
import { FontKit } from '@/src/components/editor/plugins/font-kit';
import { LineHeightKit } from '@/src/components/editor/plugins/line-height-kit';
import { LinkKit } from '@/src/components/editor/plugins/link-kit';
import { ListKit } from '@/src/components/editor/plugins/list-kit';
import { MarkdownKit } from '@/src/components/editor/plugins/markdown-kit';
import { MathKit } from '@/src/components/editor/plugins/math-kit';
import { MediaKit } from '@/src/components/editor/plugins/media-kit';
import { MentionKit } from '@/src/components/editor/plugins/mention-kit';
import { SlashKit } from '@/src/components/editor/plugins/slash-kit';
import { SuggestionKit } from '@/src/components/editor/plugins/suggestion-kit';
import { TableKit } from '@/src/components/editor/plugins/table-kit';
import { TocKit } from '@/src/components/editor/plugins/toc-kit';
import { ToggleKit } from '@/src/components/editor/plugins/toggle-kit';

export const EditorKit = [
  ...CopilotKit,
  ...AIKit,

  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Collaboration
  ...DiscussionKit,
  ...CommentKit,
  ...SuggestionKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,

  HappyPlugin,
  SadPlugin,
  HappySadTransformPlugin,
  AutoformatPlugin.configure({
    options: {
      rules: happySadAutoformatRules,
    },
  }),
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
