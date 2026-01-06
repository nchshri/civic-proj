import type {
  ChatMessage,
  ToolName,
} from '@/src/components/editor/use-chat';
import type { NextRequest } from 'next/server';

import { createGateway } from '@ai-sdk/gateway';
import {
  type LanguageModel,
  type UIMessageStreamWriter,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  streamObject,
  streamText,
  tool,
} from 'ai';
import { NextResponse } from 'next/server';
import { type SlateEditor, createSlateEditor, nanoid } from 'platejs';
import { z } from 'zod';

import { BaseEditorKit } from '@/src/components/editor/editor-base-kit';
import { markdownJoinerTransform } from '@/src/lib/markdown-joiner-transform';

import {
  getChooseToolPrompt,
  getCommentPrompt,
  getEditPrompt,
  getGeneratePrompt,
} from './prompts';

export async function POST(req: NextRequest) {
  const {
    apiKey: key,
    ctx,
    messages: messagesRaw = [],
    model,
    pageType, // Extract pageType from the request body
  } = await req.json();

  console.log('=== API DEBUG ===');
  console.log('pageType:', pageType);

  const { children, selection, toolName: toolNameParam } = ctx;

  const editor = createSlateEditor({
    plugins: BaseEditorKit,
    selection,
    value: children,
  });

  const apiKey = key || process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing AI Gateway API key.' },
      { status: 401 }
    );
  }

  // Create system prompt based on pageType
  const systemPrompt = pageType === 'happy'
    ? 'You are a helpful writing assistant that rewrites text to be more positive, uplifting, and happy. Maintain the core message but make it sound optimistic and cheerful.'
    : pageType === 'sad'
    ? 'You are a helpful writing assistant that rewrites text to be more negative, melancholic, and sad. Maintain the core message but make it sound pessimistic and gloomy.'
    : 'You are a helpful writing assistant.';

  console.log('systemPrompt:', systemPrompt);
  console.log('=================');

  const isSelecting = editor.api.isExpanded();

  const gatewayProvider = createGateway({
    apiKey,
  });

  try {
    const stream = createUIMessageStream<ChatMessage>({
      execute: async ({ writer }) => {
        let toolName = toolNameParam;

        if (!toolName) {
          const { object: AIToolName } = await generateObject({
            enum: isSelecting
              ? ['generate', 'edit', 'comment']
              : ['generate', 'comment'],
            model: gatewayProvider(model || 'google/gemini-2.5-flash'),
            output: 'enum',
            prompt: getChooseToolPrompt(messagesRaw),
          });

          writer.write({
            data: AIToolName as ToolName,
            type: 'data-toolName',
          });

          toolName = AIToolName;
        }

        const stream = streamText({
          experimental_transform: markdownJoinerTransform(),
          model: gatewayProvider(model || 'openai/gpt-4o-mini'),
          system: systemPrompt, // Add system prompt here
          prompt: '',
          tools: {
            comment: getCommentTool(editor, {
              messagesRaw,
              model: gatewayProvider(model || 'google/gemini-2.5-flash'),
              writer,
            }),
          },
          prepareStep: async (step) => {
            if (toolName === 'comment') {
              return {
                ...step,
                toolChoice: { toolName: 'comment', type: 'tool' },
              };
            }

            if (toolName === 'edit') {
              const editPrompt = getEditPrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              return {
                ...step,
                activeTools: [],
                messages: [
                  {
                    content: editPrompt,
                    role: 'user',
                  },
                ],
                system: systemPrompt, // Add system prompt for edit
              };
            }

            if (toolName === 'generate') {
              const generatePrompt = getGeneratePrompt(editor, {
                messages: messagesRaw,
              });

              return {
                ...step,
                activeTools: [],
                messages: [
                  {
                    content: generatePrompt,
                    role: 'user',
                  },
                ],
                model: gatewayProvider(model || 'openai/gpt-4o-mini'),
                system: systemPrompt, // Add system prompt for generate
              };
            }
          },
        });

        writer.merge(stream.toUIMessageStream({ sendFinish: false }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

const getCommentTool = (
  editor: SlateEditor,
  {
    messagesRaw,
    model,
    writer,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<ChatMessage>;
  }
) =>
  tool({
    description: 'Comment on the content',
    inputSchema: z.object({}),
    execute: async () => {
      const { elementStream } = streamObject({
        model,
        output: 'array',
        prompt: getCommentPrompt(editor, {
          messages: messagesRaw,
        }),
        schema: z
          .object({
            blockId: z
              .string()
              .describe(
                'The id of the starting block. If the comment spans multiple blocks, use the id of the first block.'
              ),
            comment: z
              .string()
              .describe('A brief comment or explanation for this fragment.'),
            content: z
              .string()
              .describe(
                String.raw`The original document fragment to be commented on.It can be the entire block, a small part within a block, or span multiple blocks. If spanning multiple blocks, separate them with two \n\n.`
              ),
          })
          .describe('A single comment'),
      });

      for await (const comment of elementStream) {
        const commentDataId = nanoid();

        writer.write({
          id: commentDataId,
          data: {
            comment,
            status: 'streaming',
          },
          type: 'data-comment',
        });
      }

      writer.write({
        id: nanoid(),
        data: {
          comment: null,
          status: 'finished',
        },
        type: 'data-comment',
      });
    },
  });