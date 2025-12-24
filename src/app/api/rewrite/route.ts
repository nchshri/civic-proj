import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { text, tone } = body;

    if (!text || !tone) {
      return Response.json({ error: 'Missing text or tone' }, { status: 400 });
    }

    if (tone !== 'happy' && tone !== 'sad') {
      return Response.json({ error: 'Invalid tone' }, { status: 400 });
    }

    const systemPrompt = tone === 'happy'
      ? 'You are a helpful writing assistant that rewrites text to be more positive, uplifting, and happy. Maintain the core message but make it sound optimistic and cheerful.'
      : 'You are a helpful writing assistant that rewrites text to be more negative, melancholic, and sad. Maintain the core message but make it sound pessimistic and gloomy.';

    const userPrompt = `Rewrite the following text to be more ${tone}. Keep the same general meaning but change the emotional tone. Only return the rewritten text, nothing else.\n\nText: ${text}`;

    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });

    const rewrittenText = result.text;

    if (!rewrittenText) {
      return Response.json({ error: 'AI returned empty response' }, { status: 500 });
    }

    return Response.json({ text: rewrittenText });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to rewrite text' },
      { status: 500 }
    );
  }
}