// app/api/ai/rewrite/route.ts
import { streamText } from 'ai';
import { createGateway } from '@ai-sdk/gateway';

export async function POST(req: Request) {
  const { messages, system } = await req.json();

  const gateway = createGateway({
    apiKey: process.env.AI_GATEWAY_API_KEY!,
  });

  const result = streamText({
    model: gateway('claude-sonnet-4-20250514'),
    messages,
    system,
  });

  return result.toTextStreamResponse(); // Changed from toDataStreamResponse
}