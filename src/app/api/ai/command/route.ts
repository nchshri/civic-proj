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
    pageType,
  } = await req.json();

  const { children, selection, toolName: toolNameParam } = ctx;

  console.log('API Route - Received pageType:', pageType); // DEBUG

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

  // Enhanced system prompts with explicit instructions
  const systemPrompt = pageType === 'happy'
    ? `You are a helpful writing assistant that ALWAYS rewrites text to be extremely positive, uplifting, and happy. 
       
CRITICAL INSTRUCTIONS:
- Transform ALL text to sound optimistic, cheerful, and encouraging
- Use positive words like: amazing, wonderful, exciting, great, beautiful, fantastic
- Replace negative words with positive alternatives
- Add enthusiasm and energy to the tone
- Maintain the core message but make it radiate positivity
- NEVER use negative, sad, or neutral tones

Examples:
- "The weather is okay" → "The weather is absolutely wonderful!"
- "I finished the task" → "I'm so excited - I completed the task brilliantly!"
- "It's functional" → "It works amazingly well!"

ALWAYS maintain this happy, positive tone in ALL responses.`
    : pageType === 'sad'
    ? `You are a helpful writing assistant that ALWAYS rewrites text to be melancholic, pessimistic, and sad.

CRITICAL INSTRUCTIONS:
- Transform ALL text to sound negative, gloomy, and downcast
- Use negative words like: unfortunately, sadly, disappointing, difficult, challenging, bleak
- Replace positive words with negative alternatives
- Add a sense of heaviness and difficulty to the tone
- Maintain the core message but make it sound pessimistic
- NEVER use positive, happy, or optimistic tones

Examples:
- "The weather is nice" → "The weather is barely tolerable"
- "I finished the task" → "I struggled through the task and finally finished it"
- "It works well" → "It functions, though with its share of issues"

ALWAYS maintain this sad, negative tone in ALL responses.`
    : 'You are a helpful writing assistant.';

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
          system: systemPrompt, // This is set here
          prompt: '',
          tools: {
            comment: getCommentTool(editor, {
              messagesRaw,
              model: gatewayProvider(model || 'google/gemini-2.5-flash'),
              writer,
              systemPrompt, // Pass systemPrompt to comment tool
            }),
          },
          prepareStep: async (step) => {
            if (toolName === 'comment') {
              return {
                ...step,
                system: systemPrompt, // Apply systemPrompt to comments
                toolChoice: { toolName: 'comment', type: 'tool' },
              };
            }

            if (toolName === 'edit') {
              const editPrompt = getEditPrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              // Create tone-specific instruction that overrides the prompt
              let finalPrompt = editPrompt;
              
              if (pageType === 'happy') {
                // Replace or prepend tone instruction
                finalPrompt = `CRITICAL INSTRUCTION: You MUST rewrite ALL text to be extremely positive, uplifting, cheerful, and enthusiastic. Use words like: amazing, wonderful, fantastic, exciting, brilliant, delightful. Transform negative or neutral phrases into positive ones. Make everything sound optimistic and happy.

${editPrompt}

REMINDER: Your output MUST be positive and cheerful in tone.`;
              } else if (pageType === 'sad') {
                finalPrompt = `CRITICAL INSTRUCTION: You MUST rewrite ALL text to be melancholic, pessimistic, gloomy, and downcast. Use words like: unfortunately, sadly, disappointing, difficult, challenging, bleak, unfortunate. Transform positive or neutral phrases into negative ones. Make everything sound pessimistic and sad.

${editPrompt}

REMINDER: Your output MUST be negative and gloomy in tone.`;
              }

              return {
                ...step,
                activeTools: [],
                messages: [
                  {
                    content: finalPrompt,
                    role: 'user',
                  },
                ],
                system: systemPrompt,
              };
            }

            if (toolName === 'generate') {
              const generatePrompt = getGeneratePrompt(editor, {
                messages: messagesRaw,
              });

              // Create tone-specific instruction
              let finalPrompt = generatePrompt;
              
              if (pageType === 'happy') {
                finalPrompt = `CRITICAL INSTRUCTION: You MUST generate text that is extremely positive, uplifting, cheerful, and enthusiastic. Use words like: amazing, wonderful, fantastic, exciting, brilliant, delightful. Make everything sound optimistic and happy.

${generatePrompt}

REMINDER: Your output MUST be positive and cheerful in tone.`;
              } else if (pageType === 'sad') {
                finalPrompt = `CRITICAL INSTRUCTION: You MUST generate text that is melancholic, pessimistic, gloomy, and downcast. Use words like: unfortunately, sadly, disappointing, difficult, challenging, bleak, unfortunate. Make everything sound pessimistic and sad.

${generatePrompt}

REMINDER: Your output MUST be negative and gloomy in tone.`;
              }

              return {
                ...step,
                activeTools: [],
                messages: [
                  {
                    content: finalPrompt,
                    role: 'user',
                  },
                ],
                model: gatewayProvider(model || 'openai/gpt-4o-mini'),
                system: systemPrompt,
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
    systemPrompt,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<ChatMessage>;
    systemPrompt: string;
  }
) =>
  tool({
    description: 'Comment on the content',
    inputSchema: z.object({}),
    execute: async () => {
      const { elementStream } = streamObject({
        model,
        output: 'array',
        system: systemPrompt, // Apply systemPrompt to comments
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