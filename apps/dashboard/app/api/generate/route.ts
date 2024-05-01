import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { match } from 'ts-pattern';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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
        role: 'system',
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
        role: 'system',
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
        role: 'system',
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
        role: 'system',
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
        role: 'system',
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
        role: 'system',
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
    .run() as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'Respond in Croatian unless the user requests otherwise.',
      },
      ...messages,
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
