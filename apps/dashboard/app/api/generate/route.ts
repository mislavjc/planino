import { openai } from '@ai-sdk/openai';
import { CoreMessage, StreamingTextResponse, streamText } from 'ai';
import { match } from 'ts-pattern';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '') {
    return new Response(
      'Missing OPENAI_API_KEY - make sure to add it to your .env file.',
      {
        status: 400,
      },
    );
  }

  const { prompt, option, command } = await req.json();

  const messages = match(option)
    .with('continue', () => [
      {
        role: 'user',
        content:
          'You are an AI writing assistant that continues existing text based on context from prior text. ' +
          'Give more weight/priority to the later characters than the beginning ones. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
          'Use Markdown formatting when appropriate.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])
    .with('improve', () => [
      {
        role: 'user',
        content:
          'You are an AI writing assistant that improves existing text. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
          'Use Markdown formatting when appropriate.',
      },
      {
        role: 'user',
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with('shorter', () => [
      {
        role: 'user',
        content:
          'You are an AI writing assistant that shortens existing text. ' +
          'Use Markdown formatting when appropriate.',
      },
      {
        role: 'user',
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with('longer', () => [
      {
        role: 'user',
        content:
          'You are an AI writing assistant that lengthens existing text. ' +
          'Use Markdown formatting when appropriate.',
      },
      {
        role: 'user',
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with('fix', () => [
      {
        role: 'user',
        content:
          'You are an AI writing assistant that fixes grammar and spelling errors in existing text. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
          'Use Markdown formatting when appropriate.',
      },
      {
        role: 'user',
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with('zap', () => [
      {
        role: 'user',
        content:
          'You area an AI writing assistant that generates text based on a prompt. ' +
          'You take an input from the user and a command for manipulating the text' +
          'Use Markdown formatting when appropriate.',
      },
      {
        role: 'user',
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .run() as CoreMessage[];

  const response = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: [
      {
        role: 'user',
        content: 'Respond in Croatian unless the user requests otherwise.',
      },
      ...messages,
    ],
  });

  return new StreamingTextResponse(response.toAIStream());
}
